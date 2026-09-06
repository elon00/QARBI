import { execFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd, args = []) => {
  console.log(`\n▶ ${cmd} ${args.join(" ")}`);
  execFileSync(cmd, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
};

const REQUIRED = [
  "package.json", "package-lock.json", "README.md", ".env.example",
  "contracts/QARBIToken.sol", "contracts/AgentRegistry.sol", "contracts/TaskMarket.sol",
  "contracts/ConwayEngine.sol", "contracts/AgentWallet.sol", "src/App.tsx",
  "src/contracts/contractArtifacts.ts", "src/contracts/deployedAddresses.json", "netlify.toml",
];

function assert(condition, message) {
  if (!condition) throw new Error(`FINISH GATE FAIL: ${message}`);
}

console.log("QARBI MASTER FINISHER — canonical pipeline");

for (const rel of REQUIRED) assert(existsSync(join(root, rel)), `missing required file: ${rel}`);

for (const forbidden of [
  ".netlify/functions/api.zip",
  ".netlify/netlify.toml",
  ".netlify/functions/manifest.json",
]) {
  assert(!existsSync(join(root, forbidden)), `generated/local artifact present: ${forbidden}`);
}

const ignore = readFileSync(join(root, ".gitignore"), "utf8");
assert(ignore.includes(".netlify/"), ".gitignore must exclude .netlify/");

// Canonical truth gate: source must not advertise simulated values as verified live execution.
const scanFiles = [
  "README.md",
  "server.ts",
  "netlify/functions/api.mts",
  "src/components/WhitepaperViewer.tsx",
  "src/components/ArbitrumExplorer.tsx",
  "src/components/AgentSpawner.tsx",
  "src/components/AgentTerminal.tsx",
  "src/components/TaskMarketplace.tsx",
  "src/components/SecurityEnclave.tsx",
  "src/components/ConwayVisualizer.tsx",
];

const forbiddenClaims = [
  /generated temporary deployer wallet/i,
  /Enter Deployer Private Key/i,
  /89\.4% (?:Gas )?Savings/i,
  /gasSavedStylus:\s*["']89\.4%/i,
  /status:\s*["']active["'][\s\S]{0,80}pqcVersion/i,
];

for (const rel of scanFiles) {
  const path = join(root, rel);
  if (!existsSync(path)) continue;
  const text = readFileSync(path, "utf8");
  for (const pattern of forbiddenClaims) assert(!pattern.test(text), `${rel} contains unsupported/unsafe claim matching ${pattern}`);
}

// Regenerate contract artifacts from the Solidity source of truth before all verification/build steps.
run(process.execPath, [join("scripts", "compile.js")]);
run(process.execPath, [join("scripts", "generateArtifacts.js")]);
run("npm", ["run", "typecheck"]);
run("npm", ["run", "build"]);

console.log("\nQARBI MASTER FINISHER — PASS");
console.log("Cleanliness, truth gates, contract compilation, artifact synchronization, typecheck, and production build passed.");
