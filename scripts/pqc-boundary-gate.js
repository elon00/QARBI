#!/usr/bin/env node
import fs from 'fs';
const src=fs.readFileSync('src/lib/pqcProvider.ts','utf8');
for(const required of ['keygen()', 'sign(message', 'verify(message', 'Real PQC provider is not installed/configured.']){
 if(!src.includes(required)){console.error('FAIL missing PQC provider boundary:',required);process.exit(1);}
}
console.log('PQC PROVIDER BOUNDARY: PASS');
