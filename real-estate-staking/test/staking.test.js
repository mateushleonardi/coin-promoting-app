const { ethers } = require("hardhat");

async function main() {
  const [owner, user] = await ethers.getSigners();

  const token = await ethers.getContractAt("RealEstateToken", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
  const staking = await ethers.getContractAt("RealEstateStaking","0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");

  // Transfer tokens to user
  const amount = ethers.parseUnits("1000", 18);
  await token.transfer(user.address, amount);
  console.log(`✅ Transferred 1000 RET to ${user.address}`);

  // Connect contracts to user's signer
  const tokenUser = token.connect(user);
  const stakingUser = staking.connect(user);

  // Approve staking contract to spend tokens
  await tokenUser.approve(staking.target, amount);
  console.log("✅ Approval successful");

  // Execute stake with a duration of 30 days
  const duration = 30 * 24 * 60 * 60; // 30 days in seconds
  await stakingUser.stake(amount, duration);
  console.log("✅ Stake executed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
