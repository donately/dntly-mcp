/**
 * Eval pass: drive the live https://mcp.donate.ly/mcp endpoint with a panel
 * of representative natural-language queries and report ranking quality.
 *
 * For each case, we set an "expected" doc path. We pass if that path is in
 * the top-N results, and report the rank + score so we can spot ranking
 * issues (e.g. a long integration doc outranking a focused API page).
 *
 * Run: npx tsx scripts/eval.ts
 */

interface EvalCase {
  query: string;
  /** Doc path that *should* be in the top-N. */
  expected: string;
  /** Optional second-acceptable doc, for queries that span two surfaces. */
  alsoAcceptable?: string;
  /** Top-N to call "passing". */
  topN?: number;
  /** Notes for humans reviewing the result. */
  note?: string;
}

const ENDPOINT = process.env.MCP_URL ?? 'https://mcp.donate.ly/mcp';

const CASES: EvalCase[] = [
  // Common API tasks
  { query: 'how do I create a one-time donation', expected: 'api/donations' },
  { query: 'list all donations for an account', expected: 'api/donations' },
  { query: 'refund a donation through the API', expected: 'api/donations' },
  { query: 'cancel a recurring subscription', expected: 'api/subscriptions' },
  { query: 'how does pagination work', expected: 'api/pagination' },
  { query: 'authentication and API tokens', expected: 'api/authentication' },
  { query: 'webhook event types', expected: 'api/webhooks' },

  // Embed-form
  { query: 'embed donation form on Webflow', expected: 'form/embedding' },
  { query: 'iframe mode for donation form', expected: 'form/iframe-mode' },
  { query: 'configure recurring donation frequency on the form', expected: 'form/recurring' },
  { query: 'donor pays the fee toggle', expected: 'form/donor-pays-fees' },
  { query: 'pre-fill the form via URL parameters', expected: 'form/url-prefill' },
  { query: 'custom fields on the donation form', expected: 'form/custom-fields' },

  // Components library
  { query: 'campaign list component', expected: 'components/campaign-list' },
  { query: 'fundraiser detail page', expected: 'components/fundraiser-details' },
  { query: 'getting started with dntly-components', expected: 'components/getting-started' },

  // Integrations
  { query: 'connect to Salesforce', expected: 'integrations/salesforce' },
  { query: 'Stripe statement descriptor', expected: 'integrations/stripe' },
  { query: 'HubSpot deal pipeline mapping', expected: 'integrations/hubspot' },
  { query: 'Mailchimp list sync', expected: 'integrations/mailchimp' },

  // Slightly-fuzzy / paraphrased
  { query: 'what payment methods are supported', expected: 'form/payment-methods' },
  { query: 'where do I see error codes', expected: 'api/errors' },
];

interface Match {
  path: string;
  score: number;
  title: string;
}

function parseSearchResult(text: string): Match[] {
  // The result text we generate uses headings like "### Title" then a line
  // "Path: `path` ...". Pull each (path, title, score-in-snippet) pair.
  const matches: Match[] = [];
  const re = /### (.+?)\nPath: `(.+?)` ·/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    matches.push({ title: m[1].trim(), path: m[2].trim(), score: 0 });
  }
  return matches;
}

let nextId = 1;
async function callTool(name: string, args: Record<string, unknown>): Promise<string> {
  const id = nextId++;
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id,
      method: 'tools/call',
      params: { name, arguments: args },
    }),
  });
  const body = await res.text();
  // Streamable HTTP responses come back as SSE: parse the data: line.
  const dataLine = body.split('\n').find((l) => l.startsWith('data:'));
  if (!dataLine) throw new Error(`unexpected response shape:\n${body}`);
  const json = JSON.parse(dataLine.slice('data:'.length).trim());
  return json.result?.content?.[0]?.text ?? '';
}

async function main() {
  console.log(`# eval against ${ENDPOINT}\n`);
  let passes = 0;
  let fails = 0;
  let warnings = 0;
  const failures: { c: EvalCase; rank: number; matches: Match[] }[] = [];

  for (const c of CASES) {
    const topN = c.topN ?? 5;
    const text = await callTool('search_docs', { query: c.query, limit: topN });
    const matches = parseSearchResult(text);
    const rank = matches.findIndex(
      (m) => m.path === c.expected || (c.alsoAcceptable && m.path === c.alsoAcceptable)
    );
    if (rank === -1) {
      fails++;
      console.log(`✗ "${c.query}"`);
      console.log(`  expected: ${c.expected}`);
      console.log(`  got:      ${matches.map((m) => m.path).join(', ') || '(none)'}`);
      failures.push({ c, rank: -1, matches });
    } else if (rank === 0) {
      passes++;
      console.log(`✓ "${c.query}" → ${c.expected} (rank 1)`);
    } else {
      warnings++;
      console.log(`~ "${c.query}" → ${c.expected} (rank ${rank + 1}) — top was ${matches[0].path}`);
      failures.push({ c, rank, matches });
    }
  }

  console.log(
    `\n# summary  ${passes}/${CASES.length} top-1, ${warnings}/${CASES.length} top-N-but-not-1, ${fails}/${CASES.length} miss`
  );
  if (failures.length > 0) {
    console.log('\n# follow-ups');
    for (const f of failures) {
      const status = f.rank === -1 ? 'MISS' : `rank ${f.rank + 1}`;
      console.log(`- ${status}: "${f.c.query}" → expected ${f.c.expected}`);
      if (f.c.note) console.log(`    note: ${f.c.note}`);
    }
  }
}

main().catch((err) => {
  console.error('eval failed:', err);
  process.exit(1);
});
