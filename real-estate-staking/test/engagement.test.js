// test/engagementQuests.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EngagementQuests", function () {
  let token, staking, voting, quests;
  let owner, user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    // Deploy the token
    const Token = await ethers.getContractFactory("RealEstateToken");
    token = await Token.deploy();
    await token.waitForDeployment();

    // Deploy staking contract
    const Staking = await ethers.getContractFactory("RealEstateStaking");
    staking = await Staking.deploy(token.target);
    await staking.waitForDeployment();

    // Deploy voting contract
    const Voting = await ethers.getContractFactory("PropertyVoting");
    voting = await Voting.deploy(staking.target, token.target);
    await voting.waitForDeployment();
  const Quests = await ethers.getContractFactory("EngagementQuests");
    quests = await Quests.deploy(token.target, staking.target, voting.target);
    await quests.waitForDeployment();
    // Deploy quests contract
  

    // Fund user and contracts
    const amount = ethers.parseUnits("1000", 18);
    await token.transfer(user.address, amount);
    await token.transfer(quests.target, ethers.parseUnits("100", 18));

    // Approve and stake
    await token.connect(user).approve(staking.target, amount);
    await staking.connect(user).stake(amount, 30 * 24 * 60 * 60);
  });

  it("should complete Stake1000 quest", async () => {
    await quests.checkQuests(user.address);
    const completed = await quests.completed(user.address, 1);
    expect(completed).to.equal(true);
  });

it("should complete FirstVote quest and reward user", async () => {
  await voting.setEngagementQuests(quests.target);
  await voting.connect(user).vote(1);              
  await quests.checkQuests(user.address);          

  const completed = await quests.completed(user.address, 0);
  expect(completed).to.equal(true);
});

});
