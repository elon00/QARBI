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
// Date.parse normalizes impossible dates (e.g. February 30) and accepts ambiguous strings.
// Require a real ISO calendar date, optionally with a fully specified RFC3339 time.
const validVerificationTime = value => {
  if (typeof value !== 'string') return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2}))?$/.exec(value);
  if (!match) return false;
  const [, year, month, day, hour, minute, second, zone] = match;
  const y = Number(year), m = Number(month), d = Number(day);
  if (y < 100 || m < 1 || m > 12 || d < 1 ||
      d > new Date(Date.UTC(y, m, 0)).getUTCDate()) return false;
  if (hour !== undefined && (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59)) return false;
  if (zone && zone !== 'Z') {
    const [offsetHours, offsetMinutes] = zone.slice(1).split(':').map(Number);
    if (offsetHours > 23 || offsetMinutes > 59) return false;
  }
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp <= Date.now() + 2 * 60 * 1000;
};
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
