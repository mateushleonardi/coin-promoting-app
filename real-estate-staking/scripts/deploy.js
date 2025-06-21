const { ethers } = require("hardhat");

async function main() {
  const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const Staking = await ethers.getContractFactory("RealEstateStaking");
  const staking = await Staking.deploy(tokenAddress);

  await staking.waitForDeployment();

  console.log(`✅ Staking contract deployed at: ${staking.target}`); 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
