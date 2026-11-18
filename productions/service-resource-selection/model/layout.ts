import { canvas } from '../../../packages/design-tokens/src';
import { projectToBox, type Box } from '../../../packages/geometry/src';

export const safe: Box = {
  x: -canvas.width / 2 + canvas.safeX,
  y: -canvas.height / 2 + canvas.safeY,
  width: canvas.width - 2 * canvas.safeX,
  height: canvas.height - 2 * canvas.safeY,
};

export const regions = {
  header: { x: -880, y: -465, width: 1760, height: 220 },
  map: { x: -880, y: -225, width: 1212, height: 612 },
  panel: { x: 358, y: -225, width: 522, height: 612 },
  footer: { x: -880, y: 418, width: 1760, height: 58 },
} satisfies Record<string, Box>;

export const mapWindow: Box = { x: -854, y: -142, width: 1160, height: 443 };
export const markerSize = 29;
export const projectResource = projectToBox({ x: -800, y: -112, width: 1052, height: 385 });
