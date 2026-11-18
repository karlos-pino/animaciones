import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFile, readFile, rename, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { checkMedia, presets, toolVersion, verifyPng } from './media.mjs';
import { cliArgs, loadProduction, root } from './production.mjs';

const args = cliArgs();
if (args.length > 1) throw new Error('Uso: release:manifest -- [producción]');
const production = await loadProduction(args[0]);
const { output } = production;
const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));

function git(args) {
  return spawnSync('git', args, { cwd: root, encoding: 'utf8', windowsHide: true });
}
function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}
const files = git([
  'ls-files',
  '-z',
  '--cached',
  '--others',
  '--exclude-standard',
  '--',
  'apps/motion-studio',
  'packages',
  `productions/${production.id}`,
  'scripts',
  'assets/licenses',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'tsconfig.base.json',
]);
if (files.status !== 0) throw new Error(files.stderr || 'Git es necesario para trazar las fuentes');
const sourceFiles = [...new Set(files.stdout.split('\0').filter(Boolean))].sort();
const sources = await Promise.all(
  sourceFiles.map(async (path) => ({
    path,
    sha256: sha256(await readFile(resolve(root, path))),
  })),
);
const head = git(['rev-parse', '--verify', 'HEAD']);
const commit = head.status === 0 ? head.stdout.trim() : null;
const status = git(['status', '--porcelain', '--untracked-files=normal']);
assert.equal(status.status, 0, 'Git no pudo consultar el estado');

const verification = Object.fromEntries(
  Object.entries(presets).map(([name, preset]) => [
    name,
    checkMedia(resolve(output, `${name}.mp4`), preset, production.duration),
  ]),
);
const still = JSON.parse(await readFile(resolve(output, 'checkpoints.json'), 'utf8'));
assert.deepEqual(still.checkpoints, production.checkpoints);
assert.equal(still.duration, production.duration);
assert.equal(still.fps, presets.preview.fps);
const renderInfo = {};
for (const name of Object.keys(presets)) {
  const { chromium, encoder, ...stats } = JSON.parse(
    await readFile(resolve(output, `${name}.render.json`), 'utf8'),
  );
  assert.deepEqual(stats, verification[name]);
  renderInfo[name] = { chromium, encoder };
}
await copyFile(resolve(production.source, 'alternative.md'), resolve(output, 'alternative.md'));

const deliveries = [
  'preview.mp4',
  'master.mp4',
  'poster.png',
  'alternative.md',
  'checkpoints.json',
  ...production.checkpoints.map((checkpoint) => `checkpoints/${checkpoint.id}.png`),
];
const contents = await Promise.all(
  deliveries.map(async (file) => {
    const bytes = await readFile(resolve(output, file));
    if (file.endsWith('.png')) {
      const preset = file === 'poster.png' ? presets.master : presets.preview;
      verifyPng(bytes, preset.width, preset.height);
    }
    return { file, bytes: bytes.length, sha256: sha256(bytes) };
  }),
);

const manifest = {
  production: production.id,
  version: pkg.version,
  commit,
  workingTree: status.stdout.trim() ? 'dirty' : 'clean',
  sourceSha256: sha256(JSON.stringify(sources)),
  sources,
  facts: production.brief.facts,
  assetLicenses: [
    {
      asset: 'Inter Variable',
      package: '@fontsource-variable/inter@5.3.0',
      license: 'OFL-1.1',
      reference: 'assets/licenses/README.md',
    },
    { asset: 'Mapa, glifos y datos sintéticos', origin: 'Fuentes originales del estudio' },
  ],
  presets,
  toolchain: {
    node: process.version,
    pnpm: pkg.packageManager,
    motionCanvas: pkg.dependencies['@motion-canvas/core'],
    playwright: pkg.devDependencies['@playwright/test'],
    ffprobe: toolVersion('ffprobe'),
    render: renderInfo,
  },
  verification,
  checkpoints: {
    chromium: still.chromium,
    ...production.checkpoints.reduce((times, item) => ({ ...times, [item.id]: item.seconds }), {}),
  },
  files: contents,
};
const temp = resolve(output, `.manifest-${process.pid}.json`);
await writeFile(temp, JSON.stringify(manifest, null, 2) + '\n');
await rename(temp, resolve(output, 'manifest.json'));
console.log(`Manifiesto con ${contents.length} archivos: ${resolve(output, 'manifest.json')}`);
