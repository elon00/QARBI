#!/usr/bin/env node
import fs from 'fs';
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const src=fs.readFileSync('src/lib/crypto.ts','utf8');
const deps={...pkg.dependencies,...pkg.devDependencies};
const hasProvider=Object.keys(deps).some(n=>/ml-dsa|dilithium|post-quantum/i.test(n));
if(hasProvider && src.includes('UNVERIFIED-PQC-COMMITMENT')){
 console.error('FAIL: PQC dependency exists but placeholder adapter remains; complete integration or remove dependency.');
 process.exit(1);
}
if(!hasProvider && !src.includes('UNVERIFIED-PQC-COMMITMENT')){
 console.error('FAIL: real PQC claim without a declared PQC provider.');
 process.exit(1);
}
console.log(hasProvider?'PQC provider declared; implementation evidence still required.':'PQC placeholder state is explicit and honest.');
