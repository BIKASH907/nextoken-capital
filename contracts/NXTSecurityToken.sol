// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title NXTSecurityToken
 * @notice ERC-3643 inspired security token for Nextoken Capital
 * @dev Compliance-enforced transfers with identity registry integration
 *
 * Features:
 *   - Role-based access (ADMIN, MINTER, COMPLIANCE)
 *   - Whitelist-only transfers (KYC enforcement)
 *   - Pausable (emergency kill switch)
 *   - Freeze individual wallets
 *   - Forced transfers (court orders / recovery)
 *   - On-chain cap table
 */
contract NXTSecurityToken is ERC20, AccessControl, Pausable {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    // Identity Registry
    mapping(address => bool) public whitelisted;
    mapping(address => bool) public frozen;

    // Asset metadata
    string public assetId;        // Database asset ID
    string public assetType;      // real_estate, bond, equity, etc.
    string public jurisdiction;   // EU, US, SG, etc.
    uint256 public maxSupply;

    // Cap table
    address[] public holders;
    mapping(address => bool) private isHolder;

    // Events
    event Whitelisted(address indexed account, bool status);
    event Frozen(address indexed account, bool status);
    event ForcedTransfer(address indexed from, address indexed to, uint256 amount, string reason);
    event ComplianceCheck(address indexed from, address indexed to, bool passed, string reason);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        string memory _assetId,
        string memory _assetType,
        string memory _jurisdiction,
        address _admin
    ) ERC20(_name, _symbol) {
        maxSupply = _maxSupply;
        assetId = _assetId;
        assetType = _assetType;
        jurisdiction = _jurisdiction;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(MINTER_ROLE, _admin);
        _grantRole(COMPLIANCE_ROLE, _admin);

        // Whitelist admin
        whitelisted[_admin] = true;
    }

    // ── MINTING ─────────────────────────────────────────────────────────────

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(whitelisted[to], "NXT: recipient not whitelisted");
        require(!frozen[to], "NXT: recipient is frozen");
        require(totalSupply() + amount <= maxSupply, "NXT: exceeds max supply");

        _mint(to, amount);
        _addHolder(to);
    }

    function batchMint(address[] calldata recipients, uint256[] calldata amounts)
        external onlyRole(MINTER_ROLE) whenNotPaused
    {
        require(recipients.length == amounts.length, "NXT: length mismatch");
        for (uint256 i = 0; i < recipients.length; i++) {
            require(whitelisted[recipients[i]], "NXT: recipient not whitelisted");
            require(!frozen[recipients[i]], "NXT: recipient frozen");
            _mint(recipients[i], amounts[i]);
            _addHolder(recipients[i]);
        }
        require(totalSupply() <= maxSupply, "NXT: exceeds max supply");
    }

    // ── COMPLIANCE TRANSFERS ────────────────────────────────────────────────

    function _update(address from, address to, uint256 value) internal override {
        // Allow minting (from = zero) and burning (to = zero)
        if (from != address(0) && to != address(0)) {
            require(!paused(), "NXT: transfers paused");
            require(whitelisted[from], "NXT: sender not whitelisted");
            require(whitelisted[to], "NXT: recipient not whitelisted");
            require(!frozen[from], "NXT: sender is frozen");
            require(!frozen[to], "NXT: recipient is frozen");

            emit ComplianceCheck(from, to, true, "Transfer approved");
        }

        super._update(from, to, value);

        if (to != address(0)) _addHolder(to);
    }

    // ── FORCED TRANSFER (court order / recovery) ────────────────────────────

    function forcedTransfer(
        address from,
        address to,
        uint256 amount,
        string calldata reason
    ) external onlyRole(COMPLIANCE_ROLE) {
        require(whitelisted[to], "NXT: target not whitelisted");
        _transfer(from, to, amount);
        emit ForcedTransfer(from, to, amount, reason);
    }

    // ── WHITELIST MANAGEMENT ────────────────────────────────────────────────

    function setWhitelisted(address account, bool status) external onlyRole(COMPLIANCE_ROLE) {
        whitelisted[account] = status;
        emit Whitelisted(account, status);
    }

    function batchWhitelist(address[] calldata accounts, bool status) external onlyRole(COMPLIANCE_ROLE) {
        for (uint256 i = 0; i < accounts.length; i++) {
            whitelisted[accounts[i]] = status;
            emit Whitelisted(accounts[i], status);
        }
    }

    // ── FREEZE MANAGEMENT ───────────────────────────────────────────────────

    function setFrozen(address account, bool status) external onlyRole(COMPLIANCE_ROLE) {
        frozen[account] = status;
        emit Frozen(account, status);
    }

    // ── PAUSE (Kill Switch) ─────────────────────────────────────────────────

    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    // ── BURN ────────────────────────────────────────────────────────────────

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) external onlyRole(ADMIN_ROLE) {
        _burn(account, amount);
    }

    // ── CAP TABLE ───────────────────────────────────────────────────────────

    function _addHolder(address account) private {
        if (!isHolder[account] && balanceOf(account) > 0) {
            holders.push(account);
            isHolder[account] = true;
        }
    }

    function getHolders() external view returns (address[] memory) {
        return holders;
    }

    function getHolderCount() external view returns (uint256) {
        return holders.length;
    }

    // ── VIEW ────────────────────────────────────────────────────────────────

    function isCompliant(address from, address to) external view returns (bool) {
        return whitelisted[from] && whitelisted[to] && !frozen[from] && !frozen[to] && !paused();
    }
}
