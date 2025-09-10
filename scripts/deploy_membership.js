const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Verify the wallet address matches environment variable
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('DEPLOYER_PRIVATE_KEY environment variable is required');
  }
  
  if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
    throw new Error('DEPLOYER_PRIVATE_KEY must be a valid 64-character hex private key starting with 0x');
  }
  
  const wallet = new ethers.Wallet(privateKey);
  console.log("Expected wallet address:", wallet.address);
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BERA");
  
  console.log("Estimating gas for NFABearsMembership deployment...");
  const NFABearsMembership = await ethers.getContractFactory("NFABearsMembership");
  const deployTx = NFABearsMembership.getDeployTransaction();
  const gasEstimate = await ethers.provider.estimateGas(deployTx);
  console.log("Estimated gas:", gasEstimate.toString());
  
  console.log("Deploying NFABearsMembership contract...");
  const nfaBearsMembership = await NFABearsMembership.deploy();
  await nfaBearsMembership.waitForDeployment();
  
  const address = await nfaBearsMembership.getAddress();
  console.log("NFABearsMembership deployed to:", address);
  
  // Save deployment info
  const deploymentInfo = {
    address: address,
    abi: NFABearsMembership.interface.formatJson()
  };
  
  fs.writeFileSync(
    path.join(__dirname, "../deployed.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Deployment info saved to deployed.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 