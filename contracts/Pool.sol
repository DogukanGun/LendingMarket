// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Pool {
    struct Deposit {
        address userAddress;
        uint256 timestamp;
        uint256 amount;
        uint256 apy;
        bool isWithdrawn;
    }

    address tokenAddress;
    string public poolName;
    uint256 public totalLiquidity;
    uint256 totalBorrowed;
    uint256 public apy;
    Deposit[] public  deposits;

    uint256 private constant apyLowUtilization = 300; // 3%
    uint256 private constant apyMediumUtilization = 600; // 6%
    uint256 private constant apyHighUtilization = 1000; // 10%

    constructor(address _tokenAddress, string memory _poolName) {
        tokenAddress = _tokenAddress;
        poolName = _poolName;
    }

    function deposit(uint256 amount) external  {
        bool status = IERC20(tokenAddress).transferFrom(
                msg.sender,
                address(this),
                amount
            );
        require(status, "Transfer failed");
        totalLiquidity += amount;
        deposits.push(Deposit(msg.sender, block.timestamp, amount, apy, false));
        apy = calculateAPY();
    }

    function calculateAssetWithApy(Deposit storage depositObj) internal view returns(uint256) {
        uint256 elapsedTime = block.timestamp - depositObj.timestamp;
        return depositObj.amount *(uint256(100) + depositObj.apy)**(elapsedTime / 365 days);
    }

    function changeWithdrawStatusForUser(address userAddress, uint256 totalAmount) private {
        uint256 internalTotalAmount = 0;
        for (uint256 i = 0; i < deposits.length; i++) {
            if (!deposits[i].isWithdrawn && deposits[i].userAddress == userAddress ) {
                uint256 futureValue = calculateAssetWithApy(deposits[i]);
                if(internalTotalAmount + futureValue < totalAmount){
                    internalTotalAmount += futureValue;
                    deposits[i].isWithdrawn = true;
                }else{
                    uint256 necessaryAmount = totalAmount - internalTotalAmount;
                    deposits[i].amount -= necessaryAmount;
                }
            }
        }
    }

    function withdraw(uint256 amount) external {
        uint256 userBalance = getBalanceOfUser(msg.sender);
        if(userBalance < amount) {
            revert("Your balance is not enough");
        }    
        changeWithdrawStatusForUser(msg.sender,amount);
        IERC20(tokenAddress).transfer(msg.sender,amount);
    }

    function getUtilizationRate() public view returns (uint256) {
        if (totalLiquidity == 0) return 0;
        return (totalBorrowed * 1e18) / totalLiquidity; // 1e18 for precision
    }

    function calculateAPY() public view returns (uint256) {
        uint256 utilizationRate = getUtilizationRate();

        // Low Utilization Threshold (e.g., 40%)
        uint256 lowUtilizationThreshold = 40 * 1e16; // 40%

        // Medium Utilization Threshold (e.g., 80%)
        uint256 highUtilizationThreshold = 80 * 1e16; // 80%

        if (utilizationRate < lowUtilizationThreshold) {
            // Low utilization: Lower APY to incentivize borrowing
            return apyLowUtilization; // e.g., 3%
        } else if (utilizationRate < highUtilizationThreshold) {
            // Medium utilization: Linearly increasing APY
            uint256 slope = ((apyHighUtilization - apyMediumUtilization) *
                1e18) / (highUtilizationThreshold - lowUtilizationThreshold);
            uint256 apyIncrease = (slope *
                (utilizationRate - lowUtilizationThreshold)) / 1e18;
            return apyMediumUtilization + apyIncrease; // e.g., interpolate between 5% and 8%
        } else {
            // High utilization: Higher APY to incentivize more deposits and discourage further borrowing
            return apyHighUtilization; // e.g., 8% or more
        }
    }

    function getBalanceOfUser(address userAddress) private view returns (uint256) {
        uint256 totalDeposit = 0;
        for (uint256 i = 0; i < deposits.length; i++) {
            if (!deposits[i].isWithdrawn && deposits[i].userAddress == userAddress ) {
                totalDeposit += calculateAssetWithApy(deposits[i]);
            }
        }
        return totalDeposit;
    }

    function getMyBalance() external view returns (uint256) {
        return getBalanceOfUser(msg.sender);
    }

    function getPoolTVL() external view returns (uint256) {
        return IERC20(tokenAddress).balanceOf(address(this));
    }
}
