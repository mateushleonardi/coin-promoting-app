const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("\n🚀 Deploying contracts with:", deployer.address);

  // Deploy RealEstateToken
  const Token = await ethers.getContractFactory("RealEstateToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("✅ RealEstateToken deployed at:", token.target);

  // Deploy RealEstateStaking
  const Staking = await ethers.getContractFactory("RealEstateStaking");
  const staking = await Staking.deploy(token.target);
  await staking.waitForDeployment();
  console.log("✅ RealEstateStaking deployed at:", staking.target);

  // Fund staking contract
  const stakingFund = ethers.parseUnits("10000", 18);
  await token.transfer(staking.target, stakingFund);
  console.log("💰 Funded Staking contract with:", stakingFund.toString());

  // Deploy PropertyVoting
  const Voting = await ethers.getContractFactory("PropertyVoting");
  const voting = await Voting.deploy(staking.target, token.target);
  await voting.waitForDeployment();
  console.log("✅ PropertyVoting deployed at:", voting.target);

  // Fund voting contract
  const votingFund = ethers.parseUnits("1000", 18);
  await token.transfer(voting.target, votingFund);
  console.log("💸 Funded Voting contract with:", votingFund.toString());

  // Deploy EngagementQuests
  const Quests = await ethers.getContractFactory("EngagementQuests");
  const quests = await Quests.deploy(token.target, staking.target, voting.target);
  await quests.waitForDeployment();
  console.log("✅ EngagementQuests deployed at:", quests.target);

  // Fund quests contract
  const questsFund = ethers.parseUnits("500", 18);
  await token.transfer(quests.target, questsFund);
  console.log("🎁 Funded Quests contract with:", questsFund.toString());

  console.log("\n🎯 All contracts deployed and funded successfully.");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
