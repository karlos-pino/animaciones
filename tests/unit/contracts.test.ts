import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getTimeline, parseProduction } from '../../packages/validation/src';

const brief = readFileSync(new URL('./fixtures/brief.yaml', import.meta.url), 'utf8');
const storyboard = readFileSync(new URL('./fixtures/storyboard.yaml', import.meta.url), 'utf8');

describe('contratos de producción', () => {
  it('valida el ejemplo brief → storyboard y deriva su cronograma', () => {
    const pair = parseProduction(brief, storyboard);
    expect(pair.brief.id).toBe('guardar-acta');
    expect(getTimeline(pair.storyboard)).toEqual({
      duration: 4,
      checkpoints: [{ id: 'guardado', seconds: 3 }],
    });
  });
  it('exige audiencia', () => {
    expect(() => parseProduction(brief.replace(/^audience:.*$/m, ''), storyboard)).toThrow(
      /audience/,
    );
  });
  it('rechaza checkpoints fuera de escena', () => {
    expect(() => parseProduction(brief, storyboard.replace('at: 3', 'at: 4'))).toThrow(
      /checkpoint/,
    );
  });
  it('rechaza hechos sin fuente', () => {
    expect(() => parseProduction(brief, storyboard.replace('[F1]', '[F2]'))).toThrow(/Hecho F2/);
  });
  it('rechaza producción distinta', () => {
    expect(() => parseProduction(brief, storyboard.replace('guardar-acta', 'otra'))).toThrow(
      /IDs de producción/,
    );
  });
});
