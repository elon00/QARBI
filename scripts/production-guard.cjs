const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const productionRoots = [path.join(root, 'src'), path.join(root, 'netlify')];
const blocked = [
  'generateTxHash(',
  'mockPubKey',
  'simulatedPubKey',
  'Math.random() * 16',
  'Simulate Arbitrum Sepolia',
  'fake transaction',
  'fakeTx',
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(ts|tsx|mts|js|jsx)$/.test(entry.name) ? [full] : [];
  });
}

const files = productionRoots.flatMap((dir) => fs.existsSync(dir) ? walk(dir) : []);
const violations = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  blocked.forEach((needle) => {
    if (text.includes(needle)) violations.push(`${path.relative(root, file)} contains blocked production pattern: ${needle}`);
  });
}

if (violations.length) {
  console.error('PRODUCTION GUARD: FAIL');
  violations.forEach((v) => console.error(`- ${v}`));
  process.exit(1);
}
console.log('PRODUCTION GUARD: PASS');
