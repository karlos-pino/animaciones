import { scaleLinear } from 'd3-scale';

export interface Point {
  x: number;
  y: number;
}
export interface Box extends Point {
  width: number;
  height: number;
}

export function projectToBox(box: Box) {
  const x = scaleLinear([0, 1], [box.x, box.x + box.width]).clamp(true);
  const y = scaleLinear([0, 1], [box.y, box.y + box.height]).clamp(true);
  return (point: Point): Point => {
    if (![point.x, point.y].every(Number.isFinite)) throw new Error('Coordenadas no finitas');
    return { x: x(point.x), y: y(point.y) };
  };
}

export function contains(outer: Box, inner: Box) {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width &&
    inner.y + inner.height <= outer.y + outer.height
  );
}

export function overlaps(a: Box, b: Box) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function minSeparation(points: readonly Point[]): number {
  let min = Infinity;
  for (const [index, point] of points.entries()) {
    for (const other of points.slice(index + 1)) {
      min = Math.min(min, Math.hypot(point.x - other.x, point.y - other.y));
    }
  }
  return min;
}

export function progressFraction(value: number, total: number) {
  return total > 0 ? Math.min(1, Math.max(0, value / total)) : 0;
}

export function excludeByKey<T, Key>(
  population: readonly T[],
  survivors: readonly T[],
  key: (item: T) => Key,
): T[] {
  const retained = new Set(survivors.map(key));
  return population.filter((item) => !retained.has(key(item)));
}

function luminance(color: string) {
  if (!/^#[0-9a-f]{6}$/i.test(color)) throw new Error('Se requiere color hexadecimal RGB');
  return [1, 3, 5].reduce((sum, index, channel) => {
    const value = parseInt(color.slice(index, index + 2), 16) / 255;
    const linear = value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    return sum + linear * ([0.2126, 0.7152, 0.0722][channel] ?? 0);
  }, 0);
}

export function contrast(a: string, b: string) {
  const first = luminance(a);
  const second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}
