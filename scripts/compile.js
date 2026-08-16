import fs from 'fs';
import path from 'path';
import solc from 'solc';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const contractsDir = path.join(rootDir, 'contracts');
const abisDir = path.join(rootDir, 'src', 'contracts', 'abis');
const buildDir = path.join(rootDir, 'build', 'contracts');

if (!fs.existsSync(abisDir)) fs.mkdirSync(abisDir, { recursive: true });
if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });

const contractFiles = [
  'QARBIToken.sol',
  'AgentRegistry.sol',
  'TaskMarket.sol',
  'AgentWallet.sol',
  'ConwayEngine.sol'
];

const sources = {};
for (const file of contractFiles) {
  const filePath = path.join(contractsDir, file);
  sources[file] = {
    content: fs.readFileSync(filePath, 'utf8')
  };
}

const input = {
  language: 'Solidity',
  sources: sources,
  settings: {
    viaIR: true,
    optimizer: {
      enabled: true,
      runs: 200
    },
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']
      }
    }
  }
};

console.log('Compiling Solidity smart contracts with solc 0.8.24 (viaIR: true)...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

let hasErrors = false;
if (output.errors) {
  for (const err of output.errors) {
    if (err.severity === 'error') {
      console.error('COMPILATION ERROR:', err.formattedMessage);
      hasErrors = true;
    } else {
      console.warn('COMPILATION WARNING:', err.formattedMessage);
    }
  }
}

if (hasErrors) {
  console.error('Compilation failed with errors.');
  process.exit(1);
}

const compiledContracts = {};

for (const sourceFile in output.contracts) {
  for (const contractName in output.contracts[sourceFile]) {
    const contractData = output.contracts[sourceFile][contractName];
    const abi = contractData.abi;
    const bytecode = contractData.evm.bytecode.object;

    if (!bytecode || bytecode === '') continue;

    console.log(`✓ Compiled ${contractName} (${sourceFile}) - Bytecode length: ${bytecode.length / 2} bytes`);

    compiledContracts[contractName] = {
      contractName,
      sourceFile,
      abi,
      bytecode: '0x' + bytecode
    };

    // Save ABI JSON
    fs.writeFileSync(
      path.join(abisDir, `${contractName}.json`),
      JSON.stringify(abi, null, 2)
    );

    // Save Build Artifact
    fs.writeFileSync(
      path.join(buildDir, `${contractName}.json`),
      JSON.stringify(compiledContracts[contractName], null, 2)
    );
  }
}

console.log('All contracts compiled successfully! ABIs saved to src/contracts/abis/');
