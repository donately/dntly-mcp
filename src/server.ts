#!/usr/bin/env node
/**
 * Stdio entrypoint for dntly-mcp.
 *
 * Used by IDEs and Claude Desktop, which spawn the server as a subprocess and
 * speak JSON-RPC over stdin/stdout. Tool definitions live in `mcp.ts` so the
 * HTTP entrypoint shares them.
 *
 * The shebang is preserved through `tsc` so `dist/server.js` is the executable
 * the npm `bin` field points at — `npx @donately/mcp` runs this.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './mcp.js';
import { loadDocs } from './docs.js';

async function main() {
  // Touch the doc cache so any frontmatter/parse errors surface at boot, not
  // on the first tool call.
  const docs = loadDocs();
  // stderr only — stdout is reserved for the JSON-RPC channel.
  console.error(`[dntly-mcp/stdio] loaded ${docs.length} docs`);

  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('[dntly-mcp/stdio] fatal:', err);
  process.exit(1);
});
