require('dotenv').config();
require('@nomicfoundation/hardhat-ethers');

module.exports = {
  solidity: '0.8.23',
  networks: {
    bepolia: {
      url: 'https://bepolia.rpc.berachain.com',
      chainId: 80069,
      accounts: ['0x9d8b52f2b5269b8b32f03b0d22dcc9c28ce7be85a8752694487902fbff2e1b4e'],
    },
  },
}; 