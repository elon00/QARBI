import { execFileSync, existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const run = (cmd, args = []) => {
  console.log(`\n▶ ${cmd} ${args.join(" ")}`);
  execFileSync(cmd, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
};

const REQUIRED = [
  "package.json",
  "package-lock.json",
  "README.md",
  ".env.example",
  "contracts/QARBIToken.sol",
  "contracts/AgentRegistry.sol",
  "contracts/TaskMarket.sol",
  "contracts/ConwayEngine.sol",
  "contracts/AgentWallet.sol",
  "src/App.tsx",
  "src/contracts/contractArtifacts.ts",
  "src/contracts/deployedAddresses.json",
  "netlify.toml",
];

const FAIL_PATTERNS = [
  /Private Key/i,
  /No valid PRIVATE_KEY.*Generated temporary deployer wallet/i,
  /simulation only.*ml-dsa/i,
  /0\.245 ETH/i,
  /89\.4% vs EVM/i,
];

function assert(condition, message) {
  if (!condition) throw new Error(`FINISH GATE FAIL: ${message}`);
}

console.log("QARBI MASTER FINISHER — canonical pipeline");

for (const rel of REQUIRED) {
  assert(existsSync(join(root, rel)), `missing required file: ${rel}`);
}

// Generated/local deployment state must never be committed.
for (const forbidden of [".netlify/functions/api.zip", ".netlify/netlify.toml", ".netlify/functions/manifest.json"]) {
  assert(!existsSync(join(root, forbidden)), `generated/local artifact present: ${forbidden}`);
}

const ignore = readFileSync(join(root, ".gitignore"), "utf8");
assert(ignore.includes(".netlify/"), ".gitignore must exclude .netlify/");

// Truth gate: source and README may not claim verified production behavior for known demo-only values.
for (const rel of ["README.md", "server.ts", "netlify/functions/api.mts", "src/components/WhitepaperViewer.tsx", "src/components/ArbitrumExplorer.tsx"]) {
  const path = join(root, rel);
  if (!existsSync(path)) continue;
  const text = readFileSync(path, "utf8");
  for (const pattern of FAIL_PATTERNS) {
    assert(!pattern.test(text), `${rel} contains unsupported/unsafe claim matching ${pattern}`);
  }
}

run(process.execPath, [join("scripts", "compile.js")]);
run(process.execPath, [join("scripts", "generateArtifacts.js")]);
run("npm", ["run", "typecheck"]);
run("npm", ["run", "build"]);

console.log("\nQARBI MASTER FINISHER — PASS");
console.log("Artifacts compiled, frontend/backend build verified, and truth/cleanliness gates passed.");
