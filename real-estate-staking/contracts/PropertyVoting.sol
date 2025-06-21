// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IRealEstateStaking.sol";
import "./EngagementQuests.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyVoting is Ownable {
    IRealEstateStaking public stakingContract;
    IERC20 public realEstateToken;
    address public engagementQuests;

    mapping(uint => uint) public propertyVotes;
    mapping(address => bool) public hasVoted;

    uint256 public votingRewardAmount = 10 * 1e18;

    event Voted(address indexed voter, uint propertyId);
    event RewardIssued(address indexed voter, uint256 amount);

    constructor(address _stakingContract, address _realEstateToken) Ownable(msg.sender) {
        stakingContract = IRealEstateStaking(_stakingContract);
        realEstateToken = IERC20(_realEstateToken);
    }

    /// @notice Set the engagement quest contract address
    function setEngagementQuests(address _quests) external onlyOwner {
        engagementQuests = _quests;
    }

    /// @notice Vote for a property, receive rewards, and trigger engagement quests
    function vote(uint propertyId) external {
        require(!hasVoted[msg.sender], "You already voted");
        require(stakingContract.hasActiveStake(msg.sender), "Stake required to vote");

        propertyVotes[propertyId]++;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, propertyId);

        // Trigger quests if contract is set
        if (engagementQuests != address(0)) {
            EngagementQuests(engagementQuests).recordVote(msg.sender);
        }

        // Send reward if balance is sufficient
        if (realEstateToken.balanceOf(address(this)) >= votingRewardAmount) {
            realEstateToken.transfer(msg.sender, votingRewardAmount);
            emit RewardIssued(msg.sender, votingRewardAmount);
        }
    }

    /// @notice View total votes for a property
    function getVotes(uint propertyId) external view returns (uint) {
        return propertyVotes[propertyId];
    }

    /// @notice Allow owner to fund the contract for rewards
    function fundVotingRewards(uint256 amount) external onlyOwner {
        require(realEstateToken.transferFrom(msg.sender, address(this), amount), "Funding failed");
    }

    /// @notice Allow owner to change the voting reward amount
    function setVotingRewardAmount(uint256 newAmount) external onlyOwner {
        votingRewardAmount = newAmount;
    }
}
