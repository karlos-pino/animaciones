import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rename, rmdir, unlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { checkMedia, mediaTool, presets, toolVersion, verifyPng } from './media.mjs';
import { cliArgs, loadProduction } from './production.mjs';
import { openCapture, withStudioBrowser } from './studio-browser.mjs';

const args = cliArgs();
const [name, id] = args;
if (!Object.hasOwn(presets, name) || args.length > 2) {
  throw new Error('Uso: render-video.mjs preview|master [producción]');
}
const preset = presets[name];
const source = await loadProduction(id);
if (source.brief.output.audio) throw new Error('El adaptador actual admite producciones sin audio');

const encoderVersion = toolVersion('ffmpeg');
await mkdir(source.output, { recursive: true });
const staging = await mkdtemp(resolve(source.output, '.media-'));
const movie = resolve(staging, `${name}.mp4`);
const poster = resolve(staging, 'poster.png');
const ffmpeg = spawn(
  mediaTool('ffmpeg'),
  [
    '-hide_banner',
    '-loglevel',
    'error',
    '-f',
    'image2pipe',
    '-framerate',
    String(preset.fps),
    '-vcodec',
    'png',
    '-i',
    'pipe:0',
    '-an',
    '-c:v',
    'libx264',
    '-preset',
    'medium',
    '-crf',
    String(preset.crf),
    '-vf',
    'scale=out_color_matrix=bt709,format=yuv420p',
    '-color_primaries',
    'bt709',
    '-color_trc',
    'iec61966-2-1',
    '-colorspace',
    'bt709',
    '-movflags',
    '+faststart',
    movie,
  ],
  { stdio: ['pipe', 'ignore', 'inherit'], windowsHide: true },
);
const exited = new Promise((resolveExit) => {
  ffmpeg.once('error', (error) => resolveExit({ error }));
  ffmpeg.once('close', (code, signal) => resolveExit({ code, signal }));
});
ffmpeg.stdin.on('error', () => {
  // Los errores se propagan mediante el callback de write y el estado del proceso.
});

try {
  const expected = Math.round(source.duration * preset.fps);
  let chromium;
  let frameCount = 0;
  let hasPoster = false;

  await withStudioBrowser(async (page, url, version) => {
    chromium = version;
    let posterFrame;
    const { production, capture } = await openCapture(
      page,
      url,
      async (frame, png) => {
        assert.equal(frame, frameCount, 'Fotogramas fuera de secuencia');
        if (frame === posterFrame) {
          verifyPng(png, preset.width, preset.height);
          await writeFile(poster, png);
          hasPoster = true;
        }
        await new Promise((accept, reject) =>
          ffmpeg.stdin.write(png, (error) => (error ? reject(error) : accept())),
        );
        frameCount++;
        if (frameCount % (preset.fps * 5) === 0) {
          console.log(`${name}: ${frameCount}/${expected} fotogramas`);
        }
      },
      source.id,
    );
    assert.equal(production.duration, source.duration);
    assert.deepEqual(production.checkpoints, source.checkpoints);
    if (name === 'master') {
      const marker = production.checkpoints.find(
        (checkpoint) => checkpoint.id === production.posterId,
      );
      assert(marker, 'El póster requiere un checkpoint declarado');
      posterFrame = Math.round(marker.seconds * preset.fps);
    }
    await capture({ fps: preset.fps, scale: preset.scale, frames: null });
  });

  ffmpeg.stdin.end();
  const result = await exited;
  if (result.error) throw result.error;
  assert.equal(result.code, 0, `FFmpeg falló: ${result.code ?? result.signal}`);
  assert.equal(frameCount, expected);
  if (name === 'master') assert(hasPoster, 'No se produjo el póster');

  const verification = checkMedia(movie, preset, source.duration);
  const renderInfo = resolve(staging, `${name}.render.json`);
  await writeFile(
    renderInfo,
    JSON.stringify({ chromium, encoder: encoderVersion, ...verification }, null, 2) + '\n',
  );
  await rename(movie, resolve(source.output, `${name}.mp4`));
  if (hasPoster) await rename(poster, resolve(source.output, 'poster.png'));
  await rename(renderInfo, resolve(source.output, `${name}.render.json`));
  console.log(JSON.stringify({ production: source.id, preset: name, ...verification }));
} finally {
  if (ffmpeg.exitCode === null && ffmpeg.signalCode === null) ffmpeg.kill();
  await exited;
  for (const file of [movie, poster, resolve(staging, `${name}.render.json`)]) {
    await unlink(file).catch((error) => {
      if (error.code !== 'ENOENT') throw error;
    });
  }
  await rmdir(staging);
}
