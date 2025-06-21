const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealEstateStaking - Reward Logic", function () {
  let token, staking, owner, user;
  const stakeAmount = ethers.parseUnits("1000", 18);
  const duration = 60 * 60 * 24 * 30; // 30 days in seconds (1 month)
  const monthlyPercent = 10;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("RealEstateToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    const Staking = await ethers.getContractFactory("RealEstateStaking");
    staking = await Staking.deploy(token.target);
    await staking.waitForDeployment();

    // Transfer RET tokens to user
    await token.transfer(user.address, stakeAmount);

    // Approve staking contract
    await token.connect(user).approve(staking.target, stakeAmount);
    await token.transfer(staking.target, ethers.parseUnits("10000", 18));
  });

  it("should stake tokens and calculate correct reward after 1 month", async () => {
    await staking.connect(user).stake(stakeAmount, duration);

    // Advance blockchain time by 1 month
    await ethers.provider.send("evm_increaseTime", [duration]);
    await ethers.provider.send("evm_mine");

    const userBalanceBefore = await token.balanceOf(user.address);

    // Unstake and get rewards
    const tx = await staking.connect(user).unstake();
    await tx.wait();

    const userBalanceAfter = await token.balanceOf(user.address);

    const expectedReward = stakeAmount * BigInt(monthlyPercent) / BigInt(100);
    const actualReward = userBalanceAfter - stakeAmount;

    // Assert that actual reward is close to expected (within small margin)
    expect(actualReward).to.be.closeTo(expectedReward, ethers.parseUnits("0.01", 18));
  });
});
