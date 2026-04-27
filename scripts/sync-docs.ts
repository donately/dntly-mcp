/**
 * Sync the canonical Markdown corpus from dntly-developer-hub into this repo.
 *
 * The dev-hub repo at `~/Sites/dntly-developer-hub/git-repo/docs/markdown/`
 * is the source of truth for the MCP corpus. This script copies the current
 * snapshot into `dntly-mcp/docs/` so that:
 *
 *   - the MCP server can read it at runtime,
 *   - `npm pack` bundles it into the published artifact, and
 *   - the Docker build (Railway) sees it in the build context.
 *
 * Run before `npm publish` (wired up via `prepublishOnly`) or any time the
 * dev-hub corpus changes. Idempotent.
 *
 * Run: npm run sync-docs
 */

import { mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..');
const HUB_ROOT = resolve(REPO_ROOT, '../../dntly-developer-hub/git-repo');
const HUB_CORPUS = join(HUB_ROOT, 'docs', 'markdown');
const LOCAL_DOCS = join(REPO_ROOT, 'docs');

// Only copy from these subdirectories — anything else (like a top-level
// README.md that's meant for human readers of the dev-hub repo) would crash
// the MCP loader's category inference at boot.
const CORPUS_DIRS = ['api', 'form', 'components', 'integrations'];

function copyTree(src: string, dst: string): number {
  let count = 0;
  for (const entry of readdirSync(src)) {
    const srcPath = join(src, entry);
    const dstPath = join(dst, entry);
    const st = statSync(srcPath);
    if (st.isDirectory()) {
      mkdirSync(dstPath, { recursive: true });
      count += copyTree(srcPath, dstPath);
    } else if (entry.endsWith('.md')) {
      writeFileSync(dstPath, readFileSync(srcPath));
      count++;
    }
  }
  return count;
}

function main() {
  try {
    statSync(HUB_CORPUS);
  } catch {
    console.error(
      `[sync-docs] cannot find ${HUB_CORPUS}. Make sure dntly-developer-hub is checked out at ${HUB_ROOT}.`
    );
    process.exit(1);
  }

  // Wipe the local snapshot so deletions in dev-hub propagate cleanly.
  rmSync(LOCAL_DOCS, { recursive: true, force: true });
  mkdirSync(LOCAL_DOCS, { recursive: true });

  let total = 0;
  for (const dir of CORPUS_DIRS) {
    const src = join(HUB_CORPUS, dir);
    try {
      statSync(src);
    } catch {
      continue;
    }
    const dst = join(LOCAL_DOCS, dir);
    mkdirSync(dst, { recursive: true });
    total += copyTree(src, dst);
  }
  console.log(`[sync-docs] copied ${total} markdown file(s) from ${HUB_CORPUS} → ${LOCAL_DOCS}`);
}

main();
