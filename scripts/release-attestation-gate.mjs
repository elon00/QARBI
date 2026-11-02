#!/usr/bin/env node
/* Fail-closed release attestation gate. Does not confer a security certification. */
import fs from 'node:fs';
const path = 'release-evidence/readiness.json';
const domains = ['build','tests','security','contracts','e2e','pqc','wallet','operations','governance','market'];
let evidence;
try { evidence = JSON.parse(fs.readFileSync(path, 'utf8')); }
catch (e) { console.error('BLOCKED: missing or invalid evidence manifest:', path, e.message); process.exit(1); }
const validUrl = u => {
  if (typeof u !== 'string') return false;
  try {
    const url = new URL(u);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch { return false; }
};
const validVerificationTime = value =>
  typeof value === 'string' && Number.isFinite(Date.parse(value)) &&
  Date.parse(value) <= Date.now() + 2 * 60 * 1000;
const entries = evidence.domains ?? {};
const failures=[];
for(const domain of domains) {
  const entry=entries[domain];
  if (!entry || entry.status !== 'verified' || !validUrl(entry.evidence_url)
      || !validVerificationTime(entry.verified_at)
      || typeof entry.verifier !== 'string' || !entry.verifier.trim()) {
    failures.push(domain);
  }
}
if (!Array.isArray(evidence.release_blockers) || evidence.release_blockers.length !== 0 || evidence.mainnet_authorized !== true) {
  failures.push('unresolved blockers or mainnet authorization absent');
}
const score=(10-domains.filter(d=>failures.includes(d)).length)*10;
console.log(`QARBI release manifest: ${score / 10}/10 required domain fields populated (NOT CERTIFIED; external evidence unverified)`);
if(failures.length) {
 console.error('BLOCKED:',failures.join(', '));
 process.exit(1);
}
console.log('All attestation fields populated; independently validate URLs and deployments before release.');
