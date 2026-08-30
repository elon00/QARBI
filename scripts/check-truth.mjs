import fs from "node:fs";
const files=["README.md","server.ts"];
const forbidden=[
  /1952-byte public key commitments anchored on-chain/i,
  /cryptographic proofs of completion/i,
  /Stylus.*yielding.*10x to 100x gas compression/i
];
let failed=false;
for(const file of files){
  if(!fs.existsSync(file)) continue;
  const body=fs.readFileSync(file,"utf8");
  for(const rule of forbidden){
    if(rule.test(body)){ console.error(`TRUTH CHECK FAIL: ${file} matches unsupported claim ${rule}`); failed=true; }
  }
}
if(failed) process.exit(1);
console.log("TRUTH CHECK PASS");
