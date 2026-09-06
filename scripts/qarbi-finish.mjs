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
  "src/contracts/contractArtifacts.ts", "src/contracts/deployedAddresses.json",
  "scripts/compile.js", "scripts/generateArtifacts.js", "scripts/check-env.mjs", "scripts/check-truth.mjs",
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
console.log("Repository hygiene, deterministic gates, contract compilation, artifact synchronization, typecheck and production build are covered by this pipeline.");
