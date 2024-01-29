// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";


contract LMToken is ERC20 {

    constructor() ERC20("Lending Pool","LMT") {
        _mint(msg.sender, 100000000000);
    }
}