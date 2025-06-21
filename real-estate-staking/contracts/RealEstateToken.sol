// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RealEstateToken is ERC20 {
    constructor() ERC20("Real Estate Token", "RET") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
