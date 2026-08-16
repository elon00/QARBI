import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const buildDir = path.join(rootDir, 'build', 'contracts');
const outputFile = path.join(rootDir, 'src', 'contracts', 'contractArtifacts.ts');

const contractNames = [
  'QARBIToken',
  'AgentRegistry',
  'TaskMarket',
  'ConwayEngine',
  'AgentWallet'
];

let tsContent = `// Auto-generated Contract Artifacts with EVM Bytecode & ABIs
`;

for (const name of contractNames) {
  const filePath = path.join(buildDir, `${name}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  tsContent += `
export const ${name}Artifact = ${JSON.stringify(data, null, 2)} as const;
`;
}

fs.writeFileSync(outputFile, tsContent);
console.log(`Generated ${outputFile}`);
