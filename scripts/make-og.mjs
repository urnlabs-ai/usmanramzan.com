/**
 * Generates branded OG images (1200x630) via headless Chrome.
 * Default: public/og.png
 * Posts: public/og/<slug>.png
 *
 * Usage:
 *   node scripts/make-og.mjs
 *   node scripts/make-og.mjs --title "Post title" --out public/og/slug.png
 */
import { mkdirSync, mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const args = process.argv.slice(2);
function flag(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

const title = flag('--title') ?? 'Infrastructure that holds up.';
const subtitle =
  flag('--subtitle') ??
  'CTO · fractional CTO · seven years of multi-cloud Kubernetes';
const outRel = flag('--out') ?? 'public/og.png';
const outPath = resolve(root, outRel);

const geist = join(
  root,
  'node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2'
);
const display = join(
  root,
  'node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2'
);

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: 'PlexRegular';
    src: url('file://${geist}') format('woff2');
    font-weight: 400;
  }
  @font-face {
    font-family: 'PlexMedium';
    src: url('file://${display}') format('woff2');
    font-weight: 500;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    background: #ffffff;
    color: #202922;
    font-family: 'PlexRegular', system-ui, sans-serif;
    overflow: hidden;
  }
  .frame {
    width: 1200px;
    height: 630px;
    padding: 64px 72px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #f7f8f6;
  }
  .accent {
    width: 48px;
    height: 4px;
    background: #315448;
  }
  .brand {
    margin-top: 28px;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  .title {
    margin-top: 36px;
    max-width: 980px;
    font-family: 'PlexMedium', 'PlexRegular', sans-serif;
    font-size: 56px;
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -0.03em;
  }
  .sub {
    margin-top: 28px;
    max-width: 900px;
    font-size: 22px;
    line-height: 1.4;
    color: #6b7280;
  }
  .foot {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 18px;
    color: #6b7280;
  }
  .url { font-family: ui-monospace, monospace; font-size: 16px; }
</style>
</head>
<body>
  <div class="frame">
    <div>
      <div class="accent"></div>
      <p class="brand">Usman Ramzan</p>
      <h1 class="title">${esc(title)}</h1>
      <p class="sub">${esc(subtitle)}</p>
    </div>
    <div class="foot">
      <span>Cloud platforms · reliability · technical leadership</span>
      <span class="url">usmanramzan.com</span>
    </div>
  </div>
</body>
</html>`;

const dir = mkdtempSync(join(tmpdir(), 'ur-og-'));
const profileDir = mkdtempSync(join(tmpdir(), 'ur-chrome-'));
const htmlPath = join(dir, 'og.html');
const shotPath = join(dir, 'shot.png');
writeFileSync(htmlPath, html);
mkdirSync(dirname(outPath), { recursive: true });

const candidates = ['google-chrome-stable', 'google-chrome', 'chromium', 'chromium-browser'];
let chrome = process.env.CHROME_PATH;
const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (!chrome && existsSync(macChrome)) chrome = macChrome;
for (const bin of candidates) {
  if (chrome) break;
  const r = spawnSync('which', [bin], { encoding: 'utf8' });
  if (r.status === 0) chrome = r.stdout.trim();
}

if (!chrome) {
  console.error('No Chrome/Chromium found for OG rendering');
  process.exit(1);
}

await new Promise((resolvePromise, reject) => {
  const child = spawn(
    chrome,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--force-device-scale-factor=1',
      `--user-data-dir=${profileDir}`,
      '--window-size=1200,630',
      `--screenshot=${shotPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );

  let stderr = '';
  child.stderr.on('data', (d) => {
    stderr += d.toString();
  });

  const started = Date.now();
  const poll = setInterval(() => {
    if (existsSync(shotPath) && readFileSync(shotPath).length > 10_000) {
      clearInterval(poll);
      child.kill('SIGKILL');
      resolvePromise();
    } else if (Date.now() - started > 25_000) {
      clearInterval(poll);
      child.kill('SIGKILL');
      reject(new Error(`OG screenshot timed out.\n${stderr}`));
    }
  }, 200);

  child.on('error', (err) => {
    clearInterval(poll);
    reject(err);
  });
});

if (!existsSync(shotPath)) {
  console.error('Screenshot file missing');
  rmSync(dir, { recursive: true, force: true });
  rmSync(profileDir, { recursive: true, force: true, maxRetries: 20, retryDelay: 100 });
  process.exit(1);
}

const png = readFileSync(shotPath);
writeFileSync(outPath, png);
rmSync(dir, { recursive: true, force: true });
rmSync(profileDir, { recursive: true, force: true, maxRetries: 20, retryDelay: 100 });
console.log('Wrote', outRel, `(${png.length} bytes)`);
