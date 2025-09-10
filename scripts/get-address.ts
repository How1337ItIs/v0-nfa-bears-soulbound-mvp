import { privateKeyToAccount } from 'viem/accounts';
import { keccak256, toHex } from 'viem';

const privateKey = '0x9d8b52f2b5269b8b32f03b0d22dcc9c28ce7be85a8752694487902fbff2e1b4e';
const account = privateKeyToAccount(privateKey);

console.log('Private Key:', privateKey);
console.log('Address:', account.address);
console.log('Public Key:', account.publicKey);
