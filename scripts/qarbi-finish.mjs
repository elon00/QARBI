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

const UI_FILES = [
  "src/components/AgentSpawner.tsx",
  "src/components/AgentTerminal.tsx",
  "src/components/TaskMarketplace.tsx",
  "src/components/ConwayVisualizer.tsx",
  "src/components/FaucetModal.tsx",
  "src/components/OnchainDeployerModal.tsx",
  "src/components/ArbitrumExplorer.tsx",
  "src/components/WhitepaperViewer.tsx",
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

const text = (rel) => readFileSync(join(root, rel), "utf8");
const combinedUI = UI_FILES.filter((rel) => existsSync(join(root, rel))).map(text).join("\n");

// These patterns indicate UI paths that fabricate chain evidence rather than reading a real receipt.
for (const [pattern, description] of [
  [/blockNumber:\s*18\d{6,}/i, "hardcoded historical-looking block number in UI"],
  [/gasSavedStylus:\s*["']89\.4%/i, "hardcoded Stylus gas-saving field in UI"],
  [/Direct Private Key/i, "browser private-key deployment path"],
  [/No valid PRIVATE_KEY.*Generated temporary deployer wallet/i, "temporary private-key generation path"],
]) assert(!pattern.test(combinedUI), description);

// Initial demo state must not impersonate confirmed chain state.
const state = text("src/data/initialState.ts");
assert(!/status:\s*["']CONFIRMED["']/i.test(state), "initial demo state contains fake confirmed transaction status");
assert(!/blockNumber:\s*18\d{6,}/i.test(state), "initial demo state contains fake block numbers");

// Source control must not track generated Netlify state.
assert(!existsSync(join(root, ".netlify")), ".netlify must not exist in the working tree");

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
console.log("Repository hygiene, deterministic truth gates, contract compilation, artifact synchronization, typecheck and production build are covered.");
