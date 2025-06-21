const { ethers } = require("hardhat");

async function main() {
  const stakingAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const tokenAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F";

  const Voting = await ethers.getContractFactory("PropertyVoting");
  const voting = await Voting.deploy(stakingAddress, tokenAddress);

  await voting.waitForDeployment();

  console.log(`✅ PropertyVoting contract deployed at: ${voting.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
