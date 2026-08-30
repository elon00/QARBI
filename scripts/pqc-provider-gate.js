#!/usr/bin/env node
import fs from 'fs';
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const deps={...pkg.dependencies,...pkg.devDependencies};
const hasProvider=Boolean(deps['@noble/post-quantum']);
const adapter=fs.readFileSync('src/lib/mlDsa65Provider.ts','utf8');
const placeholder=fs.readFileSync('src/lib/crypto.ts','utf8');
if(!hasProvider){
 console.error('FAIL: @noble/post-quantum is not declared.'); process.exit(1);
}
if(!adapter.includes("@noble/post-quantum/ml-dsa.js") || !adapter.includes('ml_dsa65')){
 console.error('FAIL: ML-DSA-65 adapter is not wired to the provider.'); process.exit(1);
}
if(placeholder.includes('UNVERIFIED-PQC-COMMITMENT')){
 console.error('FAIL: legacy crypto.ts placeholder remains in the production-facing adapter.'); process.exit(1);
}
console.log('PQC PROVIDER GATE: PASS');
