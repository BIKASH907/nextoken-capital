// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract NexToken is ERC20, Ownable, Pausable {
    mapping(address => bool) public whitelist;
    bool public transferRestricted = true;

    constructor(string memory name, string memory symbol, uint256 totalSupply)
        ERC20(name, symbol)
        Ownable(msg.sender)
    {
        _mint(msg.sender, totalSupply * 10**decimals());
        whitelist[msg.sender] = true;
    }

    function addToWhitelist(address account) external onlyOwner {
        whitelist[account] = true;
    }

    function removeFromWhitelist(address account) external onlyOwner {
        whitelist[account] = false;
    }

    function setTransferRestricted(bool restricted) external onlyOwner {
        transferRestricted = restricted;
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function _update(address from, address to, uint256 value) internal override {
        require(!paused(), "Token transfers paused");
        if (transferRestricted && from != address(0) && to != address(0)) {
            require(whitelist[from] && whitelist[to], "Transfer restricted to whitelisted");
        }
        super._update(from, to, value);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
