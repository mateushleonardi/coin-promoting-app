const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Full Integration - Stake → Vote → Rewards → Unstake", function () {
  let token, staking, voting;
  let owner, user;
  const stakeAmount = ethers.parseUnits("1000", 18);
  const duration = 30 * 24 * 60 * 60; // 30 days
  const votingReward = ethers.parseUnits("10", 18); // 10 RET per vote
  const stakeRewardPercent = 10; // 10% monthly reward

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy the token contract
    const Token = await ethers.getContractFactory("RealEstateToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    // Deploy the staking contract
    const Staking = await ethers.getContractFactory("RealEstateStaking");
    staking = await Staking.deploy(token.target);
    await staking.waitForDeployment();

    // Deploy the voting contract (linked to staking and token)
    const Voting = await ethers.getContractFactory("PropertyVoting");
    voting = await Voting.deploy(staking.target, token.target);
    await voting.waitForDeployment();

    // Fund voting and staking contracts with RET for rewards
    await token.transfer(voting.target, ethers.parseUnits("100", 18));
    await token.transfer(staking.target, ethers.parseUnits("1000", 18));

    // Send tokens to the user and approve staking
    await token.transfer(user.address, stakeAmount);
    const tokenUser = token.connect(user);
    const stakingUser = staking.connect(user);
    const votingUser = voting.connect(user);

    await tokenUser.approve(staking.target, stakeAmount);
    await stakingUser.stake(stakeAmount, duration);

    // User casts a vote
    await votingUser.vote(1);
  });

  it("should reward user for both voting and staking", async function () {
    // User should receive 10 RET immediately for voting
    const balanceAfterVote = await token.balanceOf(user.address);
    expect(balanceAfterVote).to.equal(votingReward);

    // Advance blockchain time by 30 days
    await ethers.provider.send("evm_increaseTime", [duration]);
    await ethers.provider.send("evm_mine");

    // User unstakes tokens
    const stakingUser = staking.connect(user);
    await stakingUser.unstake();

    const finalBalance = await token.balanceOf(user.address);
    const expectedStakeReward = stakeAmount * BigInt(stakeRewardPercent) / BigInt(100);
    const expectedFinal = votingReward + stakeAmount + expectedStakeReward;

    // Final balance should include: stake + vote reward + stake reward
    expect(finalBalance).to.equal(expectedFinal);
  });
});
