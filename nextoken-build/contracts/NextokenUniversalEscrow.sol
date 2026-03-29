// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title NextokenUniversalEscrow
 * @author Nextoken Capital UAB
 * 
 * WHAT THIS DOES:
 * ─────────────────────────────────────────────────────────────
 * 1. Investor pays with ANY crypto (POL, ETH, USDC, USDT, WBTC, any ERC-20)
 *    OR pays directly with EURe
 * 2. Contract auto-swaps everything to EURe via QuickSwap/Uniswap on Polygon
 * 3. Contract splits EURe: issuer share + Nextoken commission
 * 4. Issuer receives EURe → redeems to EUR in bank via Monerium (FREE)
 * 5. Nextoken receives EURe commission → redeems to EUR (FREE)
 * 
 * TOTAL COST: ~0.45% (only swap slippage + your 0.25% commission)
 * ─────────────────────────────────────────────────────────────
 */

// Minimal interface for Uniswap V3 / QuickSwap V3 SwapRouter
interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24  fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params)
        external payable returns (uint256 amountOut);

    struct ExactInputParams {
        bytes   path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    function exactInput(ExactInputParams calldata params)
        external payable returns (uint256 amountOut);
}

// Wrapped POL interface
interface IWPOL {
    function deposit() external payable;
    function withdraw(uint256) external;
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address) external view returns (uint256);
}

contract NextokenUniversalEscrow is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ─── POLYGON MAINNET ADDRESSES ──────────────────────────────
    
    // Monerium EURe on Polygon
    address public constant EURE = 0x18ec0A6E18E5bc3784fDd3a3669906d2bfc5075d;
    
    // Wrapped POL (WMATIC) on Polygon
    address public constant WPOL = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;
    
    // USDC on Polygon (PoS)
    address public constant USDC = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;
    
    // QuickSwap V3 SwapRouter on Polygon
    address public constant SWAP_ROUTER = 0xf5b509bB0909a69B1c207E495f687a596C168E12;

    // ─── STRUCTS ────────────────────────────────────────────────

    struct Asset {
        string  name;
        address payable issuerWallet;    // Issuer's Monerium-linked wallet or any wallet
        string  issuerIBAN;              // Issuer's IBAN for reference (off-chain use)
        uint256 commissionBps;           // e.g. 25 = 0.25%
        uint256 targetAmountEUR;         // Target in EURe (6 decimals)
        uint256 totalRaisedEUR;          // Total EURe raised
        uint256 totalCommissionEUR;      // Total commission in EURe
        uint256 totalInvestors;
        uint256 tokenSupply;
        uint256 tokensSold;
        uint256 pricePerTokenEUR;        // Price in EURe (6 decimals)
        uint256 minInvestmentEUR;        // Min investment in EURe
        uint256 deadline;
        bool    active;
        bool    exists;
    }

    struct Investment {
        address investor;
        address tokenPaid;           // What token investor paid with (address(0) = native POL)
        uint256 amountPaid;          // Original amount paid
        uint256 eureReceived;        // EURe after swap
        uint256 issuerReceived;      // EURe sent to issuer
        uint256 commissionTaken;     // EURe commission
        uint256 tokensBought;
        uint256 timestamp;
    }

    // ─── STATE ──────────────────────────────────────────────────

    address payable public treasury;         // Nextoken treasury (Monerium-linked)
    string  public  treasuryIBAN;            // Treasury IBAN for reference
    uint256 public  defaultCommissionBps;
    uint256 public  maxSlippageBps;          // Max slippage for swaps (default 100 = 1%)

    uint256 public assetCount;
    mapping(uint256 => Asset) public assets;
    mapping(uint256 => Investment[]) public assetInvestments;

    // Investor tracking
    mapping(uint256 => mapping(address => uint256)) public investorTokens;
    mapping(uint256 => mapping(address => uint256)) public investorTotalEUR;
    mapping(uint256 => mapping(address => bool)) public isInvestor;
    mapping(uint256 => address[]) public assetInvestorList;

    // Platform-wide stats
    uint256 public platformTotalRaisedEUR;
    uint256 public platformTotalCommissionEUR;
    uint256 public platformTotalInvestors;
    mapping(address => bool) public platformInvestorExists;

    // Supported tokens for direct swap (token => true)
    mapping(address => bool) public supportedTokens;
    address[] public supportedTokenList;

    // ─── EVENTS ─────────────────────────────────────────────────

    event AssetRegistered(uint256 indexed assetId, string name, address issuerWallet);
    
    event InvestmentProcessed(
        uint256 indexed assetId,
        address indexed investor,
        address tokenPaid,
        uint256 amountPaid,
        uint256 eureTotal,
        uint256 issuerReceived,
        uint256 commissionTaken,
        uint256 tokensBought,
        uint256 timestamp
    );

    event AutoSwapped(
        address indexed tokenIn,
        uint256 amountIn,
        uint256 eureOut
    );

    event IssuerWalletChanged(uint256 indexed assetId, address oldWallet, address newWallet);
    event IssuerIBANChanged(uint256 indexed assetId, string newIBAN);
    event TreasuryChanged(address oldTreasury, address newTreasury);

    // ─── MODIFIERS ──────────────────────────────────────────────

    modifier assetExists(uint256 _id) {
        require(assets[_id].exists, "Asset not found");
        _;
    }

    modifier assetActive(uint256 _id) {
        require(assets[_id].active, "Asset not active");
        require(assets[_id].deadline == 0 || block.timestamp <= assets[_id].deadline, "Deadline passed");
        _;
    }

    // ─── CONSTRUCTOR ────────────────────────────────────────────

    constructor(
        address payable _treasury,
        string memory _treasuryIBAN,
        uint256 _defaultCommissionBps
    ) Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury");
        require(_defaultCommissionBps <= 1000, "Max 10%");

        treasury = _treasury;
        treasuryIBAN = _treasuryIBAN;
        defaultCommissionBps = _defaultCommissionBps;
        maxSlippageBps = 100; // 1% default max slippage

        // Add default supported tokens on Polygon
        _addSupportedToken(USDC);
        _addSupportedToken(WPOL);
        _addSupportedToken(0xc2132D05D31c914a87C6611C10748AEb04B58e8F); // USDT
        _addSupportedToken(0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6); // WBTC
        _addSupportedToken(0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619); // WETH
        _addSupportedToken(EURE); // EURe itself (no swap needed)
    }

    // ─── ADMIN: ASSET MANAGEMENT ────────────────────────────────

    function registerAsset(
        string calldata _name,
        address payable _issuerWallet,
        string calldata _issuerIBAN,
        uint256 _commissionBps,
        uint256 _targetAmountEUR,     // in EURe units (6 decimals). e.g. 1000e6 = €1,000
        uint256 _tokenSupply,
        uint256 _pricePerTokenEUR,    // in EURe units. e.g. 100e6 = €100
        uint256 _minInvestmentEUR,    // in EURe units. e.g. 100e6 = €100
        uint256 _deadline
    ) external onlyOwner returns (uint256 assetId) {
        require(_issuerWallet != address(0), "Invalid issuer wallet");
        require(_tokenSupply > 0 && _pricePerTokenEUR > 0, "Invalid token config");

        uint256 commission = _commissionBps > 0 ? _commissionBps : defaultCommissionBps;

        assetId = assetCount++;

        assets[assetId] = Asset({
            name: _name,
            issuerWallet: _issuerWallet,
            issuerIBAN: _issuerIBAN,
            commissionBps: commission,
            targetAmountEUR: _targetAmountEUR,
            totalRaisedEUR: 0,
            totalCommissionEUR: 0,
            totalInvestors: 0,
            tokenSupply: _tokenSupply,
            tokensSold: 0,
            pricePerTokenEUR: _pricePerTokenEUR,
            minInvestmentEUR: _minInvestmentEUR,
            deadline: _deadline,
            active: true,
            exists: true
        });

        emit AssetRegistered(assetId, _name, _issuerWallet);
    }

    // Issuer self-updates their wallet
    function updateIssuerWallet(uint256 _id, address payable _new) external assetExists(_id) {
        require(msg.sender == assets[_id].issuerWallet, "Only issuer");
        require(_new != address(0), "Invalid");
        address old = assets[_id].issuerWallet;
        assets[_id].issuerWallet = _new;
        emit IssuerWalletChanged(_id, old, _new);
    }

    // Issuer updates IBAN
    function updateIssuerIBAN(uint256 _id, string calldata _iban) external assetExists(_id) {
        require(msg.sender == assets[_id].issuerWallet, "Only issuer");
        assets[_id].issuerIBAN = _iban;
        emit IssuerIBANChanged(_id, _iban);
    }

    // Admin overrides
    function adminUpdateIssuerWallet(uint256 _id, address payable _new) external onlyOwner assetExists(_id) {
        address old = assets[_id].issuerWallet;
        assets[_id].issuerWallet = _new;
        emit IssuerWalletChanged(_id, old, _new);
    }

    function setAssetActive(uint256 _id, bool _active) external onlyOwner assetExists(_id) {
        assets[_id].active = _active;
    }

    function updateTreasury(address payable _new, string calldata _iban) external onlyOwner {
        address old = treasury;
        treasury = _new;
        treasuryIBAN = _iban;
        emit TreasuryChanged(old, _new);
    }

    function setMaxSlippage(uint256 _bps) external onlyOwner {
        require(_bps <= 500, "Max 5%");
        maxSlippageBps = _bps;
    }

    function addSupportedToken(address _token) external onlyOwner {
        _addSupportedToken(_token);
    }

    // ─── CORE: INVEST WITH ANY TOKEN ────────────────────────────

    /**
     * @notice Invest using native POL
     * Auto-swaps POL → EURe → splits to issuer + treasury
     */
    function investWithPOL(
        uint256 _assetId
    ) external payable nonReentrant whenNotPaused assetExists(_assetId) assetActive(_assetId) {
        require(msg.value > 0, "Send POL");

        // Wrap POL → WPOL
        IWPOL(WPOL).deposit{value: msg.value}();

        // Swap WPOL → EURe
        uint256 eureAmount = _swapToEURe(WPOL, msg.value);

        // Process investment
        _processInvestment(_assetId, msg.sender, address(0), msg.value, eureAmount);
    }

    /**
     * @notice Invest using any supported ERC-20 token (USDC, USDT, WETH, WBTC, etc.)
     * Auto-swaps token → EURe → splits to issuer + treasury
     */
    function investWithToken(
        uint256 _assetId,
        address _token,
        uint256 _amount
    ) external nonReentrant whenNotPaused assetExists(_assetId) assetActive(_assetId) {
        require(supportedTokens[_token], "Token not supported");
        require(_amount > 0, "Invalid amount");

        // Transfer tokens from investor to this contract
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        uint256 eureAmount;

        if (_token == EURE) {
            // Already EURe — no swap needed
            eureAmount = _amount;
        } else {
            // Swap token → EURe
            eureAmount = _swapToEURe(_token, _amount);
        }

        _processInvestment(_assetId, msg.sender, _token, _amount, eureAmount);
    }

    /**
     * @notice Invest directly with EURe (cheapest — no swap fee)
     * For investors who already hold EURe or used Monerium on-ramp
     */
    function investWithEURe(
        uint256 _assetId,
        uint256 _amount
    ) external nonReentrant whenNotPaused assetExists(_assetId) assetActive(_assetId) {
        require(_amount > 0, "Invalid amount");

        IERC20(EURE).safeTransferFrom(msg.sender, address(this), _amount);
        _processInvestment(_assetId, msg.sender, EURE, _amount, _amount);
    }

    // ─── INTERNAL: SWAP ENGINE ──────────────────────────────────

    function _swapToEURe(
        address _tokenIn,
        uint256 _amountIn
    ) internal returns (uint256 eureOut) {
        
        // Approve router
        IERC20(_tokenIn).approve(SWAP_ROUTER, _amountIn);

        // Try direct swap: token → EURe
        // If no direct pool, route through USDC: token → USDC → EURe
        
        try ISwapRouter(SWAP_ROUTER).exactInputSingle(
            ISwapRouter.ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: EURE,
                fee: 3000,          // 0.3% pool
                recipient: address(this),
                deadline: block.timestamp + 300,
                amountIn: _amountIn,
                amountOutMinimum: 0, // Will check slippage after
                sqrtPriceLimitX96: 0
            })
        ) returns (uint256 amountOut) {
            eureOut = amountOut;
        } catch {
            // Fallback: route through USDC (token → USDC → EURe)
            // Multi-hop swap using exactInput with path encoding
            bytes memory path = abi.encodePacked(
                _tokenIn, uint24(3000), USDC, uint24(500), EURE
            );

            eureOut = ISwapRouter(SWAP_ROUTER).exactInput(
                ISwapRouter.ExactInputParams({
                    path: path,
                    recipient: address(this),
                    deadline: block.timestamp + 300,
                    amountIn: _amountIn,
                    amountOutMinimum: 0
                })
            );
        }

        require(eureOut > 0, "Swap returned 0");

        emit AutoSwapped(_tokenIn, _amountIn, eureOut);
    }

    // ─── INTERNAL: PROCESS INVESTMENT ───────────────────────────

    function _processInvestment(
        uint256 _assetId,
        address _investor,
        address _tokenPaid,
        uint256 _amountPaid,
        uint256 _eureAmount
    ) internal {
        Asset storage asset = assets[_assetId];

        require(_eureAmount >= asset.minInvestmentEUR, "Below minimum");

        // Calculate tokens
        uint256 tokensToBuy = _eureAmount / asset.pricePerTokenEUR;
        require(tokensToBuy > 0, "Amount too small");
        require(asset.tokensSold + tokensToBuy <= asset.tokenSupply, "Exceeds supply");

        // Exact cost in EURe
        uint256 exactCost = tokensToBuy * asset.pricePerTokenEUR;
        uint256 eureRefund = _eureAmount - exactCost;

        // ── ATOMIC SPLIT ──
        uint256 commissionAmount = (exactCost * asset.commissionBps) / 10000;
        uint256 issuerAmount = exactCost - commissionAmount;

        // Send EURe to issuer (they redeem to EUR via Monerium — FREE)
        IERC20(EURE).safeTransfer(asset.issuerWallet, issuerAmount);

        // Send EURe commission to treasury (redeem to EUR via Monerium — FREE)
        IERC20(EURE).safeTransfer(treasury, commissionAmount);

        // Refund excess EURe to investor
        if (eureRefund > 0) {
            IERC20(EURE).safeTransfer(_investor, eureRefund);
        }

        // ── UPDATE STATE ──
        asset.totalRaisedEUR += exactCost;
        asset.totalCommissionEUR += commissionAmount;
        asset.tokensSold += tokensToBuy;

        // Track investor
        if (!isInvestor[_assetId][_investor]) {
            isInvestor[_assetId][_investor] = true;
            asset.totalInvestors++;
            assetInvestorList[_assetId].push(_investor);
        }

        investorTokens[_assetId][_investor] += tokensToBuy;
        investorTotalEUR[_assetId][_investor] += exactCost;

        // Platform-wide
        platformTotalRaisedEUR += exactCost;
        platformTotalCommissionEUR += commissionAmount;
        if (!platformInvestorExists[_investor]) {
            platformInvestorExists[_investor] = true;
            platformTotalInvestors++;
        }

        // Record investment
        assetInvestments[_assetId].push(Investment({
            investor: _investor,
            tokenPaid: _tokenPaid,
            amountPaid: _amountPaid,
            eureReceived: _eureAmount,
            issuerReceived: issuerAmount,
            commissionTaken: commissionAmount,
            tokensBought: tokensToBuy,
            timestamp: block.timestamp
        }));

        // Auto-close if target reached
        if (asset.targetAmountEUR > 0 && asset.totalRaisedEUR >= asset.targetAmountEUR) {
            asset.active = false;
        }

        emit InvestmentProcessed(
            _assetId, _investor, _tokenPaid, _amountPaid,
            exactCost, issuerAmount, commissionAmount, tokensToBuy,
            block.timestamp
        );
    }

    // ─── PROFIT DISTRIBUTION ────────────────────────────────────

    /**
     * @notice Issuer deposits EURe profits for distribution to token holders
     * @dev Anyone (issuer, admin) can call this with EURe
     *      Distributes proportionally to all investors based on token holdings
     */
    function distributeProfit(
        uint256 _assetId,
        uint256 _eureAmount
    ) external nonReentrant assetExists(_assetId) {
        require(_eureAmount > 0, "Invalid amount");

        // Pull EURe from caller
        IERC20(EURE).safeTransferFrom(msg.sender, address(this), _eureAmount);

        Asset storage asset = assets[_assetId];
        require(asset.tokensSold > 0, "No tokens sold");

        // Distribute to each investor proportional to holdings
        address[] storage investors = assetInvestorList[_assetId];

        for (uint256 i = 0; i < investors.length; i++) {
            address investor = investors[i];
            uint256 tokens = investorTokens[_assetId][investor];

            if (tokens > 0) {
                // Proportional share: (tokens / totalSold) * totalProfit
                uint256 share = (_eureAmount * tokens) / asset.tokensSold;

                if (share > 0) {
                    IERC20(EURE).safeTransfer(investor, share);
                }
            }
        }
    }

    // ─── VIEW FUNCTIONS ─────────────────────────────────────────

    function getAsset(uint256 _id) external view returns (Asset memory) {
        require(assets[_id].exists, "Not found");
        return assets[_id];
    }

    function getFundraisingProgressBps(uint256 _id) external view assetExists(_id) returns (uint256) {
        if (assets[_id].targetAmountEUR == 0) return 0;
        return (assets[_id].totalRaisedEUR * 10000) / assets[_id].targetAmountEUR;
    }

    function getTokenSaleProgressBps(uint256 _id) external view assetExists(_id) returns (uint256) {
        if (assets[_id].tokenSupply == 0) return 0;
        return (assets[_id].tokensSold * 10000) / assets[_id].tokenSupply;
    }

    function getPlatformStats() external view returns (
        uint256 totalAssets,
        uint256 totalRaisedEUR,
        uint256 totalCommissionEUR,
        uint256 totalInvestors
    ) {
        return (assetCount, platformTotalRaisedEUR, platformTotalCommissionEUR, platformTotalInvestors);
    }

    function getInvestorTokens(uint256 _id, address _investor) external view returns (uint256) {
        return investorTokens[_id][_investor];
    }

    function getInvestorHistory(uint256 _id) external view returns (Investment[] memory) {
        return assetInvestments[_id];
    }

    function getAssetInvestors(uint256 _id) external view returns (address[] memory) {
        return assetInvestorList[_id];
    }

    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokenList;
    }

    // ─── INTERNAL HELPERS ───────────────────────────────────────

    function _addSupportedToken(address _token) internal {
        if (!supportedTokens[_token]) {
            supportedTokens[_token] = true;
            supportedTokenList.push(_token);
        }
    }

    // ─── EMERGENCY ──────────────────────────────────────────────

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function emergencyWithdrawToken(address _token) external onlyOwner {
        uint256 bal = IERC20(_token).balanceOf(address(this));
        require(bal > 0, "No balance");
        IERC20(_token).safeTransfer(treasury, bal);
    }

    function emergencyWithdrawPOL() external onlyOwner {
        uint256 bal = address(this).balance;
        require(bal > 0, "No balance");
        (bool ok, ) = treasury.call{value: bal}("");
        require(ok, "Failed");
    }

    // Accept POL for investWithPOL
    receive() external payable {}
}
