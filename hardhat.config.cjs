require('dotenv').config();
require('@nomicfoundation/hardhat-ethers');

// Validate environment variables
if (!process.env.DEPLOYER_PRIVATE_KEY) {
  throw new Error('DEPLOYER_PRIVATE_KEY environment variable is required');
}

if (!process.env.DEPLOYER_PRIVATE_KEY.startsWith('0x')) {
  throw new Error('DEPLOYER_PRIVATE_KEY must start with 0x');
}

module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    bepolia: {
      url: process.env.NEXT_PUBLIC_BEPOLIA_RPC || 'https://bepolia.rpc.berachain.com',
      chainId: 80069,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
      gas: 'auto',
      gasPrice: 'auto',
    },
    hardhat: {
      chainId: 1337
    }
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts'
  }
}; 