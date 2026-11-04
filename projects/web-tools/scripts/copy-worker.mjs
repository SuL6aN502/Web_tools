// Copies the pdf.js worker bundle into public/ so it can be loaded at /pdf.worker.min.mjs
// without any bundler asset tricks. Runs on postinstall and prebuild.
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const candidates = [];
try { candidates.push(path.join(path.dirname(require.resolve('pdfjs-dist')), 'pdf.worker.min.mjs')); } catch { /* ignore */ }
try { candidates.push(path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'build', 'pdf.worker.min.mjs')); } catch { /* ignore */ }

const src = candidates.find((p) => existsSync(p));
if (!src) {
  console.error('[copy-worker] pdf.worker.min.mjs not found in pdfjs-dist, skipping');
  process.exit(0);
}
const outDir = path.resolve(process.cwd(), 'public');
mkdirSync(outDir, { recursive: true });
copyFileSync(src, path.join(outDir, 'pdf.worker.min.mjs'));
console.log('[copy-worker] copied worker -> public/pdf.worker.min.mjs');
