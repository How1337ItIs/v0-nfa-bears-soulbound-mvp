const { ethers } = require("hardhat");

async function main() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('DEPLOYER_PRIVATE_KEY environment variable is required');
  }
  
  const wallet = new ethers.Wallet(privateKey);
  console.log("Wallet address:", wallet.address);
  
  const [deployer] = await ethers.getSigners();
  console.log("Hardhat signer address:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 