import { basename, resolve } from 'node:path';
import { checkMedia, presets, toolVersion } from './media.mjs';
import { cliArgs, loadProduction, root } from './production.mjs';

const args = cliArgs();
const [input, id] = args;
if (!input || args.length > 2)
  throw new Error('Uso: check:media -- ruta/preview.mp4|ruta/master.mp4 [producción]');
const name = basename(input, '.mp4');
if (!Object.hasOwn(presets, name) || !input.endsWith('.mp4'))
  throw new Error('Se espera preview.mp4 o master.mp4');
const production = await loadProduction(id);
console.log(
  JSON.stringify(
    {
      file: input,
      ffprobe: toolVersion('ffprobe'),
      ...checkMedia(resolve(root, input), presets[name], production.duration),
    },
    null,
    2,
  ),
);
