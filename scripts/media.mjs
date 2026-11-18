import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { canvas } from '../packages/design-tokens/src/index.ts';
import { root } from './production.mjs';

function preset(fps, scale, crf) {
  return { fps, scale, crf, width: canvas.width * scale, height: canvas.height * scale };
}

export const presets = {
  preview: preset(30, 0.5, 24),
  master: preset(60, 1, 17),
};

export function mediaTool(name) {
  const configured = process.env[`${name.toUpperCase()}_PATH`];
  if (configured) return configured;
  const directory = name === 'ffmpeg' ? 'encode' : 'probe';
  const portable = resolve(root, '.tools', 'ffmpeg', directory, 'package', `${name}.exe`);
  return process.platform === 'win32' && existsSync(portable) ? portable : name;
}

function run(name, args) {
  const result = spawnSync(mediaTool(name), args, { encoding: 'utf8', windowsHide: true });
  if (result.error) {
    throw new Error(`No se pudo ejecutar ${name}. Revisa PATH o ${name.toUpperCase()}_PATH.`, {
      cause: result.error,
    });
  }
  if (result.status !== 0) throw new Error(`${name}: ${result.stderr.trim()}`);
  return result.stdout;
}

export function toolVersion(name) {
  return run(name, ['-version']).split(/\r?\n/)[0];
}

function frameRate(value) {
  const [numerator, denominator] = String(value).split('/').map(Number);
  return numerator / denominator;
}

export function verifyVideo(probe, expected, duration) {
  assert.equal(probe.streams.length, 1, 'Se requiere un solo stream de video, sin audio');
  const [stream] = probe.streams;
  assert.equal(stream.codec_type, 'video');
  assert.equal(stream.codec_name, 'h264');
  assert.equal(stream.pix_fmt, 'yuv420p');
  assert.equal(stream.width, expected.width);
  assert.equal(stream.height, expected.height);
  assert.equal(frameRate(stream.avg_frame_rate), expected.fps);
  assert.equal(frameRate(stream.r_frame_rate), expected.fps);
  const count = Math.round(duration * expected.fps);
  assert.equal(Number(stream.nb_frames), count);
  const seconds = Number(probe.format.duration);
  assert(Math.abs(seconds - count / expected.fps) <= 0.001, `Duración inesperada: ${seconds}`);
  assert(probe.format.format_name.split(',').includes('mp4'), 'El contenedor debe ser MP4');
  return {
    codec: stream.codec_name,
    width: stream.width,
    height: stream.height,
    fps: expected.fps,
    frames: count,
    seconds,
    streams: probe.streams.length,
    audio: false,
    pixelFormat: stream.pix_fmt,
    bytes: Number(probe.format.size),
  };
}

export function checkMedia(file, expected, duration) {
  const output = run('ffprobe', [
    '-v',
    'error',
    '-show_streams',
    '-show_format',
    '-of',
    'json',
    file,
  ]);
  return verifyVideo(JSON.parse(output), expected, duration);
}

export function verifyPng(bytes, width, height) {
  assert(
    bytes.length >= 33 &&
      bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    'Falta firma PNG',
  );
  assert.equal(bytes.toString('ascii', 12, 16), 'IHDR');
  assert.equal(bytes.readUInt32BE(16), width);
  assert.equal(bytes.readUInt32BE(20), height);
}
