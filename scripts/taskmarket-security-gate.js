#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const contractsDir = path.join(root, 'contracts');
const files = ['QARBIToken.sol','AgentRegistry.sol','TaskMarket.sol','AgentWallet.sol','ConwayEngine.sol'];
const sources = Object.fromEntries(files.map(file => [file, { content: fs.readFileSync(path.join(contractsDir,file),'utf8') }]));
const input = { language:'Solidity', sources, settings:{ viaIR:true, optimizer:{enabled:true,runs:200}, outputSelection:{'*':{'*':['abi','evm.bytecode.object']}}}};
const output = JSON.parse(solc.compile(JSON.stringify(input)));
const errors=(output.errors||[]).filter(e=>e.severity==='error');
if(errors.length){for(const e of errors) console.error(e.formattedMessage);process.exit(1);}
const market=output.contracts['TaskMarket.sol'].TaskMarket;
const required=['createTask','claimTask','submitProofAndSettle','cancelTask'];
const names=new Set(market.abi.filter(x=>x.type==='function').map(x=>x.name));
for(const name of required){if(!names.has(name)){console.error('FAIL missing TaskMarket function',name);process.exit(1);}}
const source=sources['TaskMarket.sol'].content;
const forbidden=[
 'msg.sender == task.creator || msg.sender == protocolAdmin',
 'msg.sender == owner || msg.sender == sessionWallet || msg.sender == protocolAdmin'
];
for(const pattern of forbidden){if(source.includes(pattern)){console.error('FAIL overprivileged authorization remains:',pattern);process.exit(1);}}
if(!source.includes('NOT cryptographically verified on-chain')){console.error('FAIL proof semantics disclaimer missing');process.exit(1);}
console.log('TASKMARKET SECURITY GATE: PASS');
