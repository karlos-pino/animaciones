import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { openCapture, withStudioBrowser } from './studio-browser.mjs';
import { cliArgs, loadProduction } from './production.mjs';
import { presets, verifyPng } from './media.mjs';

const args = cliArgs();
if (args.length > 1) throw new Error('Uso: checkpoints -- [producción]');
const source = await loadProduction(args[0]);
const out = source.output;
const folder = resolve(out, 'checkpoints');
await mkdir(folder, { recursive: true });

await withStudioBrowser(async (page, url, chromium) => {
  const targets = new Map();
  const captured = new Set();
  const { production, capture } = await openCapture(
    page,
    url,
    async (frame, png) => {
      const name = targets.get(frame);
      assert(name, `Fotograma inesperado: ${frame}`);
      verifyPng(png, presets.preview.width, presets.preview.height);
      captured.add(frame);
      await writeFile(resolve(folder, `${name}.png`), png);
    },
    source.id,
  );
  assert.deepEqual(production.checkpoints, source.checkpoints);
  const { fps, scale } = presets.preview;
  for (const marker of production.checkpoints) {
    targets.set(Math.round(marker.seconds * fps), marker.id);
  }
  await capture({ fps, scale, frames: [...targets.keys()] });
  assert.deepEqual(captured, new Set(targets.keys()));
  await writeFile(
    resolve(out, 'checkpoints.json'),
    JSON.stringify({ chromium, fps, ...production }, null, 2),
  );
  console.log(`${captured.size} checkpoints de Motion Canvas en ${folder}`);
});
