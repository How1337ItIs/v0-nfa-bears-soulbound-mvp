const { ethers, artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const to = process.argv[4]; // --to 0xAddress
  if (!to) throw new Error("Usage: npx hardhat run scripts/mint_membership.ts --network bepolia --to 0xAddress");

  const deployed = JSON.parse(fs.readFileSync(path.join(__dirname, "../deployed.json"), "utf8"));
  const [deployer] = await ethers.getSigners();
  const contract = new ethers.Contract(deployed.address, deployed.abi, deployer);
  const tx = await contract.mintMembership(to);
  const receipt = await tx.wait();
  console.log("Minted to:", to);
  console.log("txHash:", receipt.transactionHash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 