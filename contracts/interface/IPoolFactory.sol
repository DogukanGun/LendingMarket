
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


interface IPoolFactory {
    function createPool(address _tokenAddress, string memory _poolName) external returns(address);
}