// SPDX-License-Identifier: GPL-3.0

import "lending_market/Pool.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "lending_market/interface/IPoolFactory.sol";

pragma solidity >=0.7.0 <0.9.0;

contract PoolFactory is Ownable, IPoolFactory {

    constructor() Ownable(msg.sender){}

    function createPool(address _tokenAddress, string memory _poolName) external onlyOwner returns(address){
        return address(new Pool(_tokenAddress,_poolName));
    }

}