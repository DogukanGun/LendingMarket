
// SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.7.0 <0.9.0;


interface IPoolData {
     struct Pool {
        string poolName;
        address poolAddress;
    }

    function addPoolData(string calldata poolName,address poolAddress) external;
    function getPoolData() external view returns(Pool[] memory);
}