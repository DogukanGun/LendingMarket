// SPDX-License-Identifier: GPL-3.0

import "lending_market/Pool.sol";

pragma solidity >=0.7.0 <0.9.0;

contract PoolFactory {

    function createPool(address _tokenAddress, string memory _poolName) external returns(address){
        return address(new Pool(_tokenAddress,_poolName));
    }
    
}