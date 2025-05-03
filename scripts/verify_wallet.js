const { ethers } = require("hardhat");

async function main() {
  const privateKey = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d';
  const wallet = new ethers.Wallet(privateKey);
  console.log("Wallet address:", wallet.address);
  
  const [deployer] = await ethers.getSigners();
  console.log("Hardhat signer address:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 