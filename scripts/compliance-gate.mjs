#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const required=[
 'compliance/LEGAL-TRUTH-BASELINE.md',
 'compliance/CLAIMS-REGISTRY.json',
 'compliance/JURISDICTION-MATRIX.md'
];
let failures=0;
for(const file of required){
 if(fs.existsSync(path.join(root,file))) console.log('PASS compliance baseline:',file);
 else { console.error('FAIL missing compliance baseline:',file); failures++; }
}
const registryPath=path.join(root,'compliance/CLAIMS-REGISTRY.json');
try{
 const registry=JSON.parse(fs.readFileSync(registryPath,'utf8'));
 const ids=new Set((registry.claims||[]).map(x=>x.id));
 for(const id of ['blockchain.testnet','wallet.browser','stylus.live','legal.compliance']){
  if(ids.has(id)) console.log('PASS claims registry:',id);
  else { console.error('FAIL claims registry missing:',id); failures++; }
 }
}catch(err){ console.error('FAIL invalid claims registry:',err.message); failures++; }
console.log('Compliance gate scope: repository evidence controls only. PASS is not legal advice, regulatory approval, or certification.');
process.exit(failures?1:0);
