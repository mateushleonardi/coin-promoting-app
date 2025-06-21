// scripts/deploy-quests.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const tokenAddress = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";
  const stakingAddress = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";
  const votingAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";

  console.log("Deploying EngagementQuests...");

  const Quests = await ethers.getContractFactory("EngagementQuests");
  const quests = await Quests.deploy(tokenAddress, stakingAddress, votingAddress);
  await quests.waitForDeployment();

  console.log("✅ EngagementQuests deployed at:", quests.target);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
