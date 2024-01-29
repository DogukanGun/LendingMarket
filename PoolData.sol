// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/access/Ownable.sol";
pragma solidity >=0.7.0 <0.9.0;


contract PoolData is Ownable{

    struct Pool {
        string poolName;
        address poolAddress;
    }

    Pool[] public  poolData;

    constructor(address _daoAddress)
        Ownable(_daoAddress) {}


    function addPoolData(string calldata poolName,address poolAddress) external onlyOwner {
        poolData.push(Pool(poolName,poolAddress));
    }
    
}