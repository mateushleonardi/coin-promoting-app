const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyVoting", function () {
  let staking, token, voting;
  let owner, userWithStake, userWithoutStake;

  beforeEach(async function () {
    [owner, userWithStake, userWithoutStake] = await ethers.getSigners();

    // Deploy token and staking contracts
    const Token = await ethers.getContractFactory("RealEstateToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    const Staking = await ethers.getContractFactory("RealEstateStaking");
    staking = await Staking.deploy(token.target);
    await staking.waitForDeployment();

    // Deploy voting contract linked to staking and token
    const Voting = await ethers.getContractFactory("PropertyVoting");
    voting = await Voting.deploy(staking.target, token.target);
    await voting.waitForDeployment();

    // 💸 Fund the voting contract to pay rewards
    const votingFund = ethers.parseUnits("100", 18);
    await token.transfer(voting.target, votingFund);

    // Stake tokens from userWithStake
    const amount = ethers.parseUnits("1000", 18);
    const duration = 30 * 24 * 60 * 60;

    await token.transfer(userWithStake.address, amount);

    const tokenWithUser = token.connect(userWithStake);
    const stakingWithUser = staking.connect(userWithStake);

    await tokenWithUser.approve(staking.target, amount);
    await stakingWithUser.stake(amount, duration);
  });

  it("should allow a staked user to vote", async function () {
    await voting.connect(userWithStake).vote(1);
    const votes = await voting.getVotes(1);
    expect(votes).to.equal(1);
  });

  it("should reject a vote from an unstaked user", async function () {
    await expect(
      voting.connect(userWithoutStake).vote(2)
    ).to.be.revertedWith("Stake required to vote");
  });

  it("should prevent double voting", async function () {
    await voting.connect(userWithStake).vote(3);
    await expect(
      voting.connect(userWithStake).vote(3)
    ).to.be.revertedWith("You already voted");
  });

  it("should reward staked user with tokens after voting", async function () {
    const balanceBefore = await token.balanceOf(userWithStake.address);

    await voting.connect(userWithStake).vote(4);

    const balanceAfter = await token.balanceOf(userWithStake.address);
    const reward = balanceAfter - balanceBefore;

    expect(reward).to.equal(ethers.parseUnits("10", 18)); // 10 tokens de recompensa
  });
});
