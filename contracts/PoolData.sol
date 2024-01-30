// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/access/Ownable.sol";
import "lending_market/interface/IPoolData.sol";
pragma solidity >=0.7.0 <0.9.0;


contract PoolData is Ownable, IPoolData{

    Pool[] public  poolData;

    constructor()
        Ownable(msg.sender) {}


    function addPoolData(string calldata poolName,address poolAddress) external onlyOwner {
        poolData.push(Pool(poolName,poolAddress));
    }

    function getPoolData() external view returns(Pool[] memory){
        return poolData;
    }
    
}