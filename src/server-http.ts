/**
 * HTTP entrypoint for dntly-mcp.
 *
 * Implements the MCP Streamable HTTP transport at `POST /mcp` in stateless
 * mode — every request gets a fresh `McpServer` + transport. Stateless is
 * the right choice here because all our tools are deterministic functions
 * over an in-memory doc corpus; there's no per-session state worth keeping.
 *
 * Also exposes `GET /healthz` so Railway / load balancers have something to
 * probe, and `GET /` for a tiny human-readable splash so anyone hitting the
 * domain in a browser sees something useful.
 */

import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from './mcp.js';
import { loadDocs } from './docs.js';

const PORT = Number(process.env.PORT ?? 3000);

const docs = loadDocs();
console.log(`[dntly-mcp/http] loaded ${docs.length} docs`);

const app = express();
app.use(express.json({ limit: '4mb' }));

app.get('/healthz', (_req, res) => {
  res.json({ ok: true, docs: docs.length });
});

app.get('/', (_req, res) => {
  res.type('text/plain').send(
    [
      'dntly-mcp — Donately developer docs as an MCP toolset.',
      '',
      `POST /mcp        Streamable HTTP MCP endpoint (stateless)`,
      `GET  /healthz    health check`,
      '',
      `Loaded docs: ${docs.length}`,
      '',
      'See https://developer.donately.com for the canonical docs and',
      'https://github.com/donately/dntly-mcp for source + install instructions.',
    ].join('\n')
  );
});

app.post('/mcp', async (req, res) => {
  // Stateless mode: spin up a fresh server + transport per request. No session
  // tracking, no in-memory connection state. Cheap because tool registration
  // is a few hundred microseconds and the doc corpus is module-level cached.
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on('close', () => {
    transport.close();
    server.close();
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error('[dntly-mcp/http] request error:', err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
    }
  }
});

// The MCP Streamable HTTP spec reserves GET/DELETE on the same URL for
// session-aware flows. We're stateless, so we 405 them with a JSON-RPC error.
const methodNotAllowed = (_req: express.Request, res: express.Response) => {
  res.status(405).json({
    jsonrpc: '2.0',
    error: { code: -32000, message: 'Method not allowed (server is stateless).' },
    id: null,
  });
};
app.get('/mcp', methodNotAllowed);
app.delete('/mcp', methodNotAllowed);

const server = app.listen(PORT, () => {
  console.log(`[dntly-mcp/http] listening on :${PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`[dntly-mcp/http] received ${signal}, shutting down`);
  server.close(() => process.exit(0));
  // Hard fallback: don't hang forever waiting on idle keepalives.
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
