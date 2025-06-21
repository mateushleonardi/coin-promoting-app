const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("🔨 Deploying contracts with the account:", deployer.address);

  const RealEstateToken = await ethers.getContractFactory("RealEstateToken");
  const token = await RealEstateToken.deploy();
  await token.waitForDeployment();
  console.log("✅ RealEstateToken deployed at:", token.target);

  const RealEstateStaking = await ethers.getContractFactory("RealEstateStaking");
  const staking = await RealEstateStaking.deploy(token.target);
  await staking.waitForDeployment();
  console.log("✅ RealEstateStaking deployed at:", staking.target);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
