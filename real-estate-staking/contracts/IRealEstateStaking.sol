// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRealEstateStaking {
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 duration;
        bool claimed;
    }

    function stakes(address user) external view returns (StakeInfo memory);
    function hasActiveStake(address user) external view returns (bool);
}
