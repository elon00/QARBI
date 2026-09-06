import { execFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const auditOnly = process.argv.includes("--audit-only");
const run = (cmd, args = []) => {
  console.log(`\n▶ ${cmd} ${args.join(" ")}`);
  execFileSync(cmd, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
};
const assert = (condition, message) => {
  if (!condition) throw new Error(`FINISH GATE FAIL: ${message}`);
};

const REQUIRED = [
  "package.json", "package-lock.json", "README.md", ".env.example", ".gitignore", "netlify.toml",
  "contracts/QARBIToken.sol", "contracts/AgentRegistry.sol", "contracts/TaskMarket.sol",
  "contracts/ConwayEngine.sol", "contracts/AgentWallet.sol", "src/App.tsx",
  "src/lib/web3.ts", "src/lib/policyEngine.ts", "src/contracts/contractArtifacts.ts", "src/contracts/deployedAddresses.json",
  "scripts/compile.js", "scripts/generateArtifacts.js", "scripts/check-env.mjs", "scripts/check-truth.mjs",
];

const SOURCE_FILES = [
  "README.md",
  "server.ts",
  "netlify/functions/api.mts",
  "src/components/AgentSpawner.tsx",
  "src/components/AgentTerminal.tsx",
  "src/components/TaskMarketplace.tsx",
  "src/components/ConwayVisualizer.tsx",
  "src/components/FaucetModal.tsx",
  "src/components/OnchainDeployerModal.tsx",
  "src/components/ArbitrumExplorer.tsx",
  "src/components/WhitepaperViewer.tsx",
  "src/data/initialState.ts",
  "src/data/translations.ts",
  "src/lib/crypto.ts",
  "src/lib/conwayEngine.ts",
];

console.log(`QARBI MASTER FINISHER — ${auditOnly ? "audit-only" : "canonical completion"}`);

for (const rel of REQUIRED) assert(existsSync(join(root, rel)), `missing required file: ${rel}`);
for (const forbidden of [
  ".netlify/functions/api.zip",
  ".netlify/netlify.toml",
  ".netlify/functions/manifest.json",
]) assert(!existsSync(join(root, forbidden)), `generated/local artifact present: ${forbidden}`);

const ignore = readFileSync(join(root, ".gitignore"), "utf8");
assert(ignore.includes(".netlify/"), ".gitignore must exclude .netlify/");

const combined = SOURCE_FILES
  .filter((rel) => existsSync(join(root, rel)))
  .map((rel) => `\n--- ${rel} ---\n${readFileSync(join(root, rel), "utf8")}`)
  .join("\n");

const forbiddenTruthPatterns = [
  [/Math\.random\(\).*tx/i, "randomized transaction hash/state used as live chain proof"],
  [/generateTxHash\(/i, "generated transaction hash helper referenced by runtime UI"],
  [/status:\s*["']CONFIRMED["']/i, "hardcoded CONFIRMED transaction state in source"],
  [/blockNumber:\s*18\d{6,}/i, "hardcoded historical-looking block number in source"],
  [/89\.4%/i, "hardcoded gas saving claim"],
  [/38,500 EVM/i, "hardcoded benchmark claim"],
  [/4,120 Gas/i, "hardcoded Stylus gas claim"],
  [/Direct Private Key/i, "private-key browser deployment path"],
  [/crypto\/pqc-generate/i, "legacy PQC API endpoint must be explicitly truth-gated"],
];

for (const [pattern, description] of forbiddenTruthPatterns) {
  assert(!pattern.test(combined), description);
}

const state = readFileSync(join(root, "src/data/initialState.ts"), "utf8");
assert(!/status:\s*["']CONFIRMED["']/i.test(state), "initial state contains fake confirmed transactions");
assert(!/blockNumber:\s*18\d{6,}/i.test(state), "initial state contains fake block numbers");

if (!auditOnly) {
  run("npm", ["run", "check:env"]);
  run("npm", ["run", "check:truth"]);
  run(process.execPath, [join("scripts", "compile.js")]);
  run(process.execPath, [join("scripts", "generateArtifacts.js")]);
  run("npm", ["run", "typecheck"]);
  run("npm", ["run", "build"]);
  run("npm", ["run", "check:truth"]);
}

console.log(`\nQARBI MASTER FINISHER — ${auditOnly ? "AUDIT PASS" : "PASS"}`);
console.log("Cleanliness, truthfulness, environment gates, contract compilation, artifact synchronization, typecheck and production build are covered.");
