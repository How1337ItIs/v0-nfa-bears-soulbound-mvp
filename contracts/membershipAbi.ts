export const membershipAbi = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" }
    ],
    "name": "mintMembership",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "wallet", "type": "address" }
    ],
    "name": "hasMinted",
    "outputs": [
      { "internalType": "bool", "name": "", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const; 