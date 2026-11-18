import { describe, expect, it } from 'vitest';
import { colors } from '../../packages/design-tokens/src';
import { contains, contrast, minSeparation, overlaps } from '../../packages/geometry/src';
import {
  mapWindow,
  markerSize,
  projectResource,
  regions,
  safe,
} from '../../productions/service-resource-selection/model/layout';
import { resources } from '../../productions/service-resource-selection/model/resources';

describe('composición y accesibilidad del piloto', () => {
  it('conserva las regiones en el área segura y separadas', () => {
    const boxes = Object.values(regions);
    expect(boxes.every((box) => contains(safe, box))).toBe(true);
    expect(contains(regions.map, mapWindow)).toBe(true);
    for (const [index, first] of boxes.entries()) {
      expect(boxes.slice(index + 1).some((second) => overlaps(first, second))).toBe(false);
    }
  });

  it('coloca los 50 puntos también cuando se dibuja el anillo más grande', () => {
    const radius = (markerSize * 1.56) / 2 + 2;
    const points = resources.map((resource) => projectResource(resource.position));
    for (const { x, y } of points) {
      expect(
        contains(mapWindow, {
          x: x - radius,
          y: y - radius,
          width: 2 * radius,
          height: 2 * radius,
        }),
      ).toBe(true);
    }
    expect(minSeparation(points)).toBeGreaterThan(2 * radius + 8);
  });

  it('cumple contraste para texto y marcas funcionales', () => {
    for (const [foreground, background] of [
      [colors.ink, colors.paper],
      [colors.muted, colors.paper],
      [colors.ink, colors.surface],
      [colors.muted, colors.surface],
      [colors.teal, colors.paper],
      [colors.white, colors.dark],
      [colors.mint, colors.dark],
    ] as const) {
      expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
    }
    for (const background of [colors.map, colors.mapAlt, colors.surface]) {
      for (const marker of [colors.blue, colors.rust, colors.teal, colors.inactive]) {
        expect(contrast(marker, background)).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
