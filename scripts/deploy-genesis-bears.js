const hre = require("hardhat");

async function main() {
  console.log("🐻 Deploying NFA Genesis Bears contract...\n");

  // Get deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy Genesis Bears contract using modern syntax
  const genesisBears = await hre.ethers.deployContract("NFAGenesisBears", [deployer.address]);
  await genesisBears.waitForDeployment();

  console.log("✅ NFA Genesis Bears deployed to:", genesisBears.target);
  console.log("📝 Contract details:");
  console.log("   - Name: NFA Genesis Bears");
  console.log("   - Symbol: NFAB");
  console.log("   - Max Supply: 710");
  console.log("   - Max Per Wallet: 5");
  console.log("   - Network:", hre.network.name);
  
  // Wait for block confirmations on live networks
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations...");
    await genesisBears.deploymentTransaction().wait(5);
  }

  // Mint some test bears to the deployer
  console.log("\n🎨 Minting test Genesis Bears...");
  const mintTx = await genesisBears.mint(deployer.address, 3);
  await mintTx.wait();
  console.log("✅ Minted 3 test bears to deployer");

  // Verify balances
  const balance = await genesisBears.balanceOf(deployer.address);
  const totalSupply = await genesisBears.totalSupply();
  console.log(`📊 Deployer balance: ${balance} bears`);
  console.log(`📊 Total supply: ${totalSupply}/710 bears`);

  // Get token IDs owned
  const tokenIds = await genesisBears.tokensOfOwner(deployer.address);
  console.log("🔢 Token IDs owned:", tokenIds.map(id => id.toString()).join(", "));

  // Test public mint functionality
  console.log("\n🧪 Testing public mint...");
  const publicMintTx = await genesisBears.publicMint(1);
  await publicMintTx.wait();
  console.log("✅ Public mint successful");

  const newBalance = await genesisBears.balanceOf(deployer.address);
  const newTotalSupply = await genesisBears.totalSupply();
  console.log(`📊 Updated balance: ${newBalance} bears`);
  console.log(`📊 Updated total supply: ${newTotalSupply}/710 bears`);

  console.log("\n🎉 Genesis Bears deployment complete!");
  console.log("📋 Summary:");
  console.log(`   Contract: ${genesisBears.target}`);
  console.log(`   Network: ${hre.network.name}`);
  console.log(`   Owner: ${deployer.address}`);
  
  // Save deployment info
  const deploymentInfo = {
    contractName: "NFAGenesisBears",
    contractAddress: genesisBears.target,
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    blockNumber: genesisBears.deploymentTransaction()?.blockNumber,
    transactionHash: genesisBears.deploymentTransaction()?.hash,
    timestamp: new Date().toISOString(),
    totalSupply: newTotalSupply.toString(),
    maxSupply: "710",
  };

  const fs = require('fs');
  const path = require('path');
  
  if (!fs.existsSync('deployments')) {
    fs.mkdirSync('deployments');
  }
  
  fs.writeFileSync(
    path.join('deployments', `genesis-bears-${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log(`📁 Deployment info saved to deployments/genesis-bears-${hre.network.name}.json`);
  
  // Add to .env for easy access
  console.log("\n📝 Add this to your .env file:");
  console.log(`GENESIS_BEARS_CONTRACT=${genesisBears.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
