// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./NXTSecurityToken.sol";

/**
 * @title NXTTokenFactory
 * @notice Factory to deploy new security tokens for each asset listing
 */
contract NXTTokenFactory {
    address public owner;
    address[] public deployedTokens;

    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        string assetId;
        string assetType;
        uint256 maxSupply;
        uint256 deployedAt;
    }

    mapping(address => TokenInfo) public tokenInfo;
    mapping(string => address) public assetIdToToken; // assetId => token address

    event TokenDeployed(
        address indexed tokenAddress,
        string name,
        string symbol,
        string assetId,
        uint256 maxSupply,
        address admin
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "NXTFactory: not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function deployToken(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply,
        string memory _assetId,
        string memory _assetType,
        string memory _jurisdiction,
        address _admin
    ) external onlyOwner returns (address) {
        require(assetIdToToken[_assetId] == address(0), "NXTFactory: asset already tokenized");

        NXTSecurityToken token = new NXTSecurityToken(
            _name, _symbol, _maxSupply,
            _assetId, _assetType, _jurisdiction, _admin
        );

        address tokenAddr = address(token);
        deployedTokens.push(tokenAddr);

        tokenInfo[tokenAddr] = TokenInfo({
            tokenAddress: tokenAddr,
            name: _name,
            symbol: _symbol,
            assetId: _assetId,
            assetType: _assetType,
            maxSupply: _maxSupply,
            deployedAt: block.timestamp
        });

        assetIdToToken[_assetId] = tokenAddr;

        emit TokenDeployed(tokenAddr, _name, _symbol, _assetId, _maxSupply, _admin);
        return tokenAddr;
    }

    function getDeployedTokens() external view returns (address[] memory) {
        return deployedTokens;
    }

    function getTokenCount() external view returns (uint256) {
        return deployedTokens.length;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }
}
