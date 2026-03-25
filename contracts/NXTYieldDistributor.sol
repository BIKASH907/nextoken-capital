// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title NXTYieldDistributor
 * @notice Distributes yield/dividends to security token holders proportionally
 */
contract NXTYieldDistributor {
    address public owner;
    IERC20 public paymentToken; // USDC/EURC for yield payments

    struct Distribution {
        address tokenAddress;   // Security token
        uint256 totalAmount;    // Total yield to distribute
        uint256 distributedAt;
        uint256 holdersCount;
        bool completed;
    }

    Distribution[] public distributions;

    event YieldDistributed(
        address indexed tokenAddress,
        uint256 totalAmount,
        uint256 holdersCount,
        uint256 distributionId
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _paymentToken) {
        owner = msg.sender;
        paymentToken = IERC20(_paymentToken);
    }

    /**
     * @notice Distribute yield to all token holders proportionally
     * @param tokenAddress The security token address
     * @param totalAmount Total yield amount in payment token
     * @param holders Array of holder addresses
     * @param amounts Array of payment amounts per holder
     */
    function distribute(
        address tokenAddress,
        uint256 totalAmount,
        address[] calldata holders,
        uint256[] calldata amounts
    ) external onlyOwner {
        require(holders.length == amounts.length, "Length mismatch");
        require(paymentToken.balanceOf(address(this)) >= totalAmount, "Insufficient balance");

        for (uint256 i = 0; i < holders.length; i++) {
            if (amounts[i] > 0) {
                paymentToken.transfer(holders[i], amounts[i]);
            }
        }

        distributions.push(Distribution({
            tokenAddress: tokenAddress,
            totalAmount: totalAmount,
            distributedAt: block.timestamp,
            holdersCount: holders.length,
            completed: true
        }));

        emit YieldDistributed(tokenAddress, totalAmount, holders.length, distributions.length - 1);
    }

    function getDistributionCount() external view returns (uint256) {
        return distributions.length;
    }

    function withdrawExcess(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner, amount);
    }
}
