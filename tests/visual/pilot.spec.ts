import { expect, test } from '@playwright/test';
import { colors } from '../../packages/design-tokens/src';
import { projectResource } from '../../productions/service-resource-selection/model/layout';
import {
  getActiveResources,
  getEligibleResources,
  request,
  resources,
} from '../../productions/service-resource-selection/model/resources';
import { openCapture } from '../../scripts/studio-browser.mjs';

const active = getActiveResources(resources);
const eligible = getEligibleResources(resources, request);
const markers = resources.map((r) => {
  const { x, y } = projectResource(r.position);
  return { id: r.id, x: Math.round(480 + x / 2), y: Math.round(270 + y / 2) };
});

const reference = {
  '01-poblacion': { visible: resources, exclusions: 0, preferred: 0 },
  '02-disponibilidad-inicio': { visible: resources, exclusions: 12, preferred: 0 },
  '03-disponibilidad-cierre': { visible: active, exclusions: 0, preferred: 0 },
  '04-solicitud': { visible: active, exclusions: 0, preferred: 0 },
  '05-nivel-inicio': { visible: active, exclusions: 22, preferred: 0 },
  '06-nivel-cierre': { visible: eligible, exclusions: 0, preferred: 16 },
  '07-resultado': { visible: eligible, exclusions: 0, preferred: 16 },
};

function colorInt(hex: string) {
  return Number.parseInt(hex.slice(1), 16);
}

test('reproduce el proyecto en el editor y permite ir al final', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/src/service-resource-selection');
  const first = page.locator('canvas').first();
  await expect(first).toHaveAttribute('width', '960', { timeout: 20000 });
  const before = await first.evaluate((node) => (node as HTMLCanvasElement).toDataURL());
  await page.locator('button[title="Play [Space]"]').click();
  await expect
    .poll(() => first.evaluate((node) => (node as HTMLCanvasElement).toDataURL()))
    .not.toEqual(before);
  await page.locator('button[title="Pause [Space]"]').click();
  await page.locator('button[title="End [Shift + Right arrow]"]').click();
  const point = markers.find((marker) => marker.id === eligible[0]?.id);
  if (!point) throw new Error('El piloto requiere al menos un recurso elegible');
  await expect
    .poll(() =>
      first.evaluate((node, { x, y }) => {
        const px = (node as HTMLCanvasElement).getContext('2d')?.getImageData(x, y, 1, 1).data;
        return px ? (px[0]! << 16) | (px[1]! << 8) | px[2]! : null;
      }, point),
    )
    .toBe(colorInt(colors.teal));
  expect(errors).toEqual([]);
});

test('conserva posiciones, marca exclusiones y coincide con los siete fotogramas revisados', async ({
  page,
  baseURL,
}, testInfo) => {
  const allFrames = new Map<number, Buffer>();
  const { production, capture } = await openCapture(page, baseURL!, (frame, png) => {
    allFrames.set(frame, png);
  });
  expect(production.checkpoints.map((item) => item.id)).toEqual(Object.keys(reference));

  const fps = 30;
  const frames = production.checkpoints.map((item) => Math.round(item.seconds * fps));
  await capture({ fps, scale: 0.5, frames });
  expect([...allFrames.keys()]).toEqual(frames);

  for (const marker of production.checkpoints) {
    const png = allFrames.get(Math.round(marker.seconds * fps));
    if (!png) throw new Error(`Checkpoint ausente: ${marker.id}`);
    const expected = reference[marker.id as keyof typeof reference];
    const detected = await page.evaluate(
      async ({ image, markers, palette }) => {
        const bytes = Uint8Array.from(atob(image), (value) => value.charCodeAt(0));
        const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Contexto 2D no disponible');
        ctx.drawImage(bitmap, 0, 0);
        const points = markers.map(({ id, x, y }) => {
          const patch = ctx.getImageData(x - 8, y - 8, 17, 17).data;
          const observed = new Set<number>();
          for (let index = 0; index < patch.length; index += 4) {
            observed.add(
              ((patch[index] ?? 0) << 16) |
                ((patch[index + 1] ?? 0) << 8) |
                (patch[index + 2] ?? 0),
            );
          }
          return {
            id,
            visible: palette.some((value) => observed.has(value)),
            excluded: observed.has(palette[1]!),
            eligible: observed.has(palette[2]!),
          };
        });
        bitmap.close();
        return { dimensions: [canvas.width, canvas.height], points };
      },
      {
        image: png.toString('base64'),
        markers,
        palette: [colors.blue, colors.rust, colors.teal, colors.inactive].map(colorInt),
      },
    );
    expect(detected.dimensions).toEqual([960, 540]);
    expect(
      detected.points.filter((point) => point.visible).map((point) => point.id),
      marker.id,
    ).toEqual(expected.visible.map((resource) => resource.id));
    expect(detected.points.filter((point) => point.excluded)).toHaveLength(expected.exclusions);
    expect(detected.points.filter((point) => point.eligible)).toHaveLength(expected.preferred);
    await testInfo.attach(marker.id, { contentType: 'image/png', body: png });
    expect(png).toMatchSnapshot(`${marker.id}.png`, { threshold: 0.12, maxDiffPixelRatio: 0.001 });
  }
});
