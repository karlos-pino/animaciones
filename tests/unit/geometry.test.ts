import { describe, expect, it } from 'vitest';
import {
  contains,
  contrast,
  excludeByKey,
  minSeparation,
  overlaps,
  progressFraction,
  projectToBox,
} from '../../packages/geometry/src';

describe('geometría y estado del estudio', () => {
  const box = { x: -500, y: -250, width: 1000, height: 500 };
  it('proyecta extremos, conserva centro y limita entradas fuera del lienzo', () => {
    const project = projectToBox(box);
    expect(project({ x: 0.5, y: 0.5 })).toEqual({ x: 0, y: 0 });
    expect(project({ x: -1, y: 2 })).toEqual({ x: -500, y: 250 });
    expect(() => project({ x: NaN, y: 0 })).toThrow();
  });
  it('identifica colisiones, áreas seguras y separación', () => {
    const inside = { x: -10, y: -10, width: 20, height: 20 };
    const adjacent = { ...inside, x: 10 };
    expect(contains(box, inside)).toBe(true);
    expect(contains(box, { ...inside, x: 495 })).toBe(false);
    expect(overlaps(inside, adjacent)).toBe(false);
    expect(overlaps(inside, { ...adjacent, x: 9 })).toBe(true);
    expect(
      minSeparation([
        { x: 0, y: 0 },
        { x: 3, y: 4 },
      ]),
    ).toBe(5);
  });
  it('deriva progreso y excluye supervivientes por identidad', () => {
    expect(progressFraction(5, 10)).toBe(0.5);
    expect(progressFraction(12, 10)).toBe(1);
    expect(progressFraction(1, 0)).toBe(0);
    expect(
      excludeByKey([{ id: 1 }, { id: 2 }, { id: 3 }], [{ id: 2 }], (resource) => resource.id),
    ).toEqual([{ id: 1 }, { id: 3 }]);
  });
  it('calcula contraste sRGB', () => {
    expect(contrast('#000000', '#ffffff')).toBe(21);
    expect(contrast('#ffffff', '#ffffff')).toBe(1);
  });
});
