import fs from "node:fs";
if (!fs.existsSync(".gitignore")) {
  console.error("ENV CHECK FAIL: .gitignore missing");
  process.exit(1);
}
const ignored = fs.readFileSync(".gitignore", "utf8");
for (const pattern of [".env", ".env.local", ".env.production.local"]) {
  if (!ignored.includes(pattern)) {
    console.error("ENV CHECK FAIL: missing ignore rule for " + pattern);
    process.exit(1);
  }
}
console.log("ENV CHECK PASS");
