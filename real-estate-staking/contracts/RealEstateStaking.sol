// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RealEstateStaking is Ownable {
    IERC20 public realEstateToken;

    uint256 public monthlyRewardPercent = 10; // 10% ao mês
    uint256 public constant SECONDS_IN_MONTH = 30 days;

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 duration;
        bool claimed;
    }

    mapping(address => StakeInfo) public stakes;

    event Staked(address indexed user, uint256 amount, uint256 duration);
    event Unstaked(address indexed user, uint256 reward);

    constructor(address _token) Ownable(msg.sender) {
        realEstateToken = IERC20(_token);
    }

    function stake(uint256 amount, uint256 durationInSeconds) external {
        require(amount > 0, "Cannot stake 0");
        require(durationInSeconds >= SECONDS_IN_MONTH, "Minimum stake: 30 days");
        require(stakes[msg.sender].amount == 0, "Already staking");

        realEstateToken.transferFrom(msg.sender, address(this), amount);

        stakes[msg.sender] = StakeInfo({
            amount: amount,
            startTime: block.timestamp,
            duration: durationInSeconds,
            claimed: false
        });

        emit Staked(msg.sender, amount, durationInSeconds);
    }

    function unstake() external {
        StakeInfo storage info = stakes[msg.sender];
        require(info.amount > 0, "No active stake");
        require(!info.claimed, "Already claimed");
        require(block.timestamp >= info.startTime + info.duration, "Stake not matured");

        // Calcula a quantidade de meses inteiros decorridos
        uint256 fullMonths = info.duration / SECONDS_IN_MONTH;

        // Calcula recompensa: ex. 10% ao mês
        uint256 reward = (info.amount * monthlyRewardPercent * fullMonths) / 100;

        info.claimed = true;

        realEstateToken.transfer(msg.sender, info.amount + reward);

        emit Unstaked(msg.sender, reward);
    }

    function hasActiveStake(address user) external view returns (bool) {
        StakeInfo memory info = stakes[user];
        return info.amount > 0 && !info.claimed;
    }

    function fundContract(uint256 amount) external onlyOwner {
        require(realEstateToken.transferFrom(msg.sender, address(this), amount), "Funding failed");
    }

}
