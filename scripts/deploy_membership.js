const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Verify the wallet address
  const privateKey = '0x9d8b52f2b5269b8b32f03b0d22dcc9c28ce7be85a8752694487902fbff2e1b4e';
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