/**
 * Smoke test: exercise the doc loader + search directly (no MCP transport).
 * Run: npx tsx scripts/smoke-test.ts
 */

import { searchDocs, getDoc, listDocs, loadDocs } from '../src/docs.js';

const docs = loadDocs();
console.log(`[load] ${docs.length} docs loaded`);

const queries = [
  'create donation',
  'stripe statement descriptor',
  'embed form iframe',
  'campaign list component',
  'salesforce',
  'recurring frequency',
];

for (const q of queries) {
  const results = searchDocs(q, { limit: 3 });
  console.log(`\n[search] "${q}" → ${results.length} hit(s)`);
  for (const r of results) {
    console.log(`  · ${r.path}  (score=${r.score})  ${r.title}`);
  }
}

console.log('\n[get_doc] api/donations:');
const donations = getDoc('api/donations');
console.log(donations ? `  title=${donations.title}  body=${donations.body.length}b` : '  null');

console.log('\n[list_docs] integrations:');
for (const d of listDocs('integrations')) console.log(`  · ${d.path}  ${d.title}`);
