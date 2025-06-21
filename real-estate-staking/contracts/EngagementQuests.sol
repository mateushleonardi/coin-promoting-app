// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IRealEstateStaking.sol";
import "./PropertyVoting.sol";

contract EngagementQuests is Ownable {
    IERC20 public rewardToken;
    IRealEstateStaking public stakingContract;
    IPropertyVoting public votingContract;

    // Define possible quest types
    enum QuestType { FirstVote, Stake1000, VoteIn3Properties }

    // Track completed quests
    mapping(address => mapping(QuestType => bool)) public completed;
    mapping(address => uint) public voteCount;

    event QuestCompleted(address indexed user, QuestType quest);

    constructor(address _token, address _staking, address _voting) Ownable(msg.sender) {
        rewardToken = IERC20(_token);
        stakingContract = IRealEstateStaking(_staking);
        votingContract = IPropertyVoting(_voting);
    }

    // Called by front-end or automation to check and trigger rewards
    function checkQuests(address user) external {
        if (!completed[user][QuestType.FirstVote] && votingContract.hasVoted(user)) {
            _completeQuest(user, QuestType.FirstVote, 10 * 1e18);
        }

        if (!completed[user][QuestType.Stake1000]) {
            IRealEstateStaking.StakeInfo memory info = stakingContract.stakes(user);
                if (info.amount >= 1000 * 1e18 && !info.claimed) {
                    _completeQuest(user, QuestType.Stake1000, 15 * 1e18);
                }
        }

        if (!completed[user][QuestType.VoteIn3Properties] && voteCount[user] >= 3) {
            _completeQuest(user, QuestType.VoteIn3Properties, 20 * 1e18);
        }
    }

    // Called by voting contract
    function recordVote(address user) external {
        require(msg.sender == address(votingContract), "Unauthorized");
        voteCount[user]++;
    }

    function _completeQuest(address user, QuestType quest, uint rewardAmount) internal {
        completed[user][quest] = true;
        rewardToken.transfer(user, rewardAmount);
        emit QuestCompleted(user, quest);
    }

    function fundContract(uint amount) external onlyOwner {
        rewardToken.transferFrom(msg.sender, address(this), amount);
    }
}

// Interface expected from voting contract
interface IPropertyVoting {
    function hasVoted(address user) external view returns (bool);
}
