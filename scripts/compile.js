import fs from 'node:fs';
import path from 'node:path';
import solc from 'solc';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contractsDir = path.join(rootDir, 'contracts');
const abisDir = path.join(rootDir, 'src', 'contracts', 'abis');
const buildDir = path.join(rootDir, 'build', 'contracts');

fs.mkdirSync(abisDir, { recursive: true });
fs.mkdirSync(buildDir, { recursive: true });

const contractFiles = [
  'QARBIToken.sol',
  'AgentRegistry.sol',
  'TaskMarket.sol',
  'AgentWallet.sol',
  'ConwayEngine.sol',
];

const sources = Object.fromEntries(
  contractFiles.map((file) => [file, { content: fs.readFileSync(path.join(contractsDir, file), 'utf8') }])
);

const input = {
  language: 'Solidity',
  sources,
  settings: {
    viaIR: true,
    optimizer: { enabled: true, runs: 200 },
    outputSelection: { '*': { '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode'] } },
  },
};

console.log('Compiling Solidity smart contracts with solc 0.8.24 (viaIR: true)...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

let hasErrors = false;
for (const err of output.errors ?? []) {
  if (err.severity === 'error') {
    console.error('COMPILATION ERROR:', err.formattedMessage);
    hasErrors = true;
  } else {
    console.warn('COMPILATION WARNING:', err.formattedMessage);
  }
}
if (hasErrors) process.exit(1);

for (const sourceFile of Object.keys(output.contracts ?? {})) {
  for (const contractName of Object.keys(output.contracts[sourceFile] ?? {})) {
    const contractData = output.contracts[sourceFile][contractName];
    const bytecode = contractData.evm.bytecode.object;
    if (!bytecode) continue;

    const artifact = {
      contractName,
      sourceFile,
      abi: contractData.abi,
      bytecode: `0x${bytecode}`,
    };
    console.log(`✓ Compiled ${contractName} (${sourceFile}) - Bytecode length: ${bytecode.length / 2} bytes`);
    fs.writeFileSync(path.join(abisDir, `${contractName}.json`), JSON.stringify(artifact.abi, null, 2) + '\n');
    fs.writeFileSync(path.join(buildDir, `${contractName}.json`), JSON.stringify(artifact, null, 2) + '\n');
  }
}
console.log('All contracts compiled successfully.');
