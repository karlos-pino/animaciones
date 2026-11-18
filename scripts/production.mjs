import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTimeline, parseProduction } from '../packages/validation/src/index.ts';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const defaultProduction = 'service-resource-selection';

export function cliArgs() {
  return process.argv.slice(2).filter((arg) => arg !== '--');
}

export async function loadProduction(id = defaultProduction) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`ID de producción inválido: ${id}`);
  const source = resolve(root, 'productions', id);
  const [briefYaml, storyboardYaml] = await Promise.all([
    readFile(resolve(source, 'brief.yaml'), 'utf8'),
    readFile(resolve(source, 'storyboard.yaml'), 'utf8'),
  ]);
  const { brief, storyboard } = parseProduction(briefYaml, storyboardYaml);
  if (brief.id !== id) throw new Error(`El brief no coincide con el directorio: ${id}`);
  return { id, source, output: resolve(root, 'dist', id), brief, ...getTimeline(storyboard) };
}
