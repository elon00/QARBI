#!/usr/bin/env node
/* Fail-closed release attestation gate. Does not confer a security certification. */
import fs from 'node:fs';
const path = 'release-evidence/readiness.json';
const domains = ['build','tests','security','contracts','e2e','pqc','wallet','operations','governance','market'];
let evidence;
try { evidence = JSON.parse(fs.readFileSync(path, 'utf8')); }
catch (e) { console.error('BLOCKED: missing or invalid evidence manifest:', path, e.message); process.exit(1); }
const validUrl = u => typeof u === 'string' && /^https:\/\//.test(u);
const entries = evidence.domains ?? {};
const failures=[];
for(const domain of domains) {
  const entry=entries[domain];
  if (!entry || entry.status !== 'verified' || !validUrl(entry.evidence_url)
      || !entry.verified_at || Number.isNaN(Date.parse(entry.verified_at))
      || typeof entry.verifier !== 'string' || !entry.verifier.trim()) {
    failures.push(domain);
  }
}
if (!Array.isArray(evidence.release_blockers) || evidence.release_blockers.length !== 0 || evidence.mainnet_authorized !== true) {
  failures.push('unresolved blockers or mainnet authorization absent');
}
const score=(10-domains.filter(d=>failures.includes(d)).length)*10;
console.log('QARBI attested score:',score+'/100');
if(failures.length) {
 console.error('BLOCKED:',failures.join(', '));
 process.exit(1);
}
console.log('All attestation fields populated; independently validate URLs and deployments before release.');
