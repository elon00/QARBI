import { ethers } from 'ethers';

const L1_RPC = 'https://ethereum-sepolia-rpc.publicnode.com';
const p = new ethers.JsonRpcProvider(L1_RPC);
const INBOX_ADDRESS = '0xaAe29B0366299461418F5324a79Afc425BE5ae21';

// Test depositEth() vs depositEth(uint256) etc.
// In Arbitrum Inbox.sol:
// function depositEth() public payable returns (uint256)
const ABI = [
  'function depositEth() external payable returns (uint256)'
];

async function run() {
  const code = await p.getCode(INBOX_ADDRESS);
  console.log('Inbox code length:', code.length);

  const iface = new ethers.Interface(ABI);
  const data = iface.encodeFunctionData('depositEth', []);
  console.log('Encoded depositEth data:', data);

  // simulate call
  try {
    const res = await p.call({
      to: INBOX_ADDRESS,
      from: '0xF34331FF53C4BDAA07793570aaad0084E7cE6DFD',
      data: data,
      value: ethers.parseEther('0.035')
    });
    console.log('Simulation success! Result:', res);
  } catch (err) {
    console.error('Simulation error:', err.message);
  }
}

run();
