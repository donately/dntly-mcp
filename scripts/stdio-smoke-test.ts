/**
 * Spawn `tsx src/server.ts`, drive it through the MCP stdio handshake, list
 * tools, and call `search_docs`. Verifies the server speaks the protocol end
 * to end. Run: npx tsx scripts/stdio-smoke-test.ts
 */

import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

type JsonRpcRequest = { jsonrpc: '2.0'; id: number; method: string; params?: unknown };

const child = spawn('npx', ['--yes', 'tsx', 'src/server.ts'], {
  cwd: REPO_ROOT,
  stdio: ['pipe', 'pipe', 'inherit'],
});

let buffer = '';
const pending = new Map<number, (msg: any) => void>();

child.stdout.on('data', (chunk: Buffer) => {
  buffer += chunk.toString('utf8');
  let idx;
  while ((idx = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) continue;
    try {
      const msg = JSON.parse(line);
      const handler = msg.id != null ? pending.get(msg.id) : null;
      if (handler) {
        pending.delete(msg.id);
        handler(msg);
      }
    } catch (err) {
      console.error('parse error on:', line);
    }
  }
});

let nextId = 1;
function send(method: string, params?: unknown): Promise<any> {
  const id = nextId++;
  const req: JsonRpcRequest = { jsonrpc: '2.0', id, method, params };
  return new Promise((resolve) => {
    pending.set(id, resolve);
    child.stdin.write(JSON.stringify(req) + '\n');
  });
}

async function main() {
  const init = await send('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'smoke-test', version: '0.0.0' },
  });
  console.log('[init]', init.result?.serverInfo);

  // initialized notification (no id)
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

  const tools = await send('tools/list');
  console.log('[tools/list]', tools.result?.tools?.map((t: any) => t.name));

  const search = await send('tools/call', {
    name: 'search_docs',
    arguments: { query: 'create donation', limit: 2 },
  });
  console.log('\n[search_docs result]\n' + (search.result?.content?.[0]?.text ?? JSON.stringify(search)));

  const list = await send('tools/call', {
    name: 'list_docs',
    arguments: { category: 'integrations' },
  });
  const listText = list.result?.content?.[0]?.text ?? '';
  console.log('\n[list_docs result, first 6 lines]\n' + listText.split('\n').slice(0, 6).join('\n'));

  child.kill();
  process.exit(0);
}

main().catch((err) => {
  console.error('smoke test failed:', err);
  child.kill();
  process.exit(1);
});
