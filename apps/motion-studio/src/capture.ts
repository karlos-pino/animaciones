import { LogLevel, Renderer, RendererResult, Vector2 } from '@motion-canvas/core';
import { canvas } from '../../../packages/design-tokens/src';
const entries = {
  'service-resource-selection': () =>
    Promise.all([
      import('./capture-project?project'),
      import('../../../productions/service-resource-selection/scenes/story'),
    ] as const),
};
const selection = new URL(location.href).searchParams.get('production');
if (!selection || !Object.hasOwn(entries, selection))
  throw new Error(`Producción desconocida: ${selection}`);
const [{ default: project }, { timeline, posterId }] =
  await entries[selection as keyof typeof entries]();

const errors: string[] = [];
project.logger.onLogged.subscribe((event) => {
  if (event.level === LogLevel.Error) errors.push(event.message);
});

window.studioProduction = { ...timeline, posterId };
window.captureStudio = async ({ fps, scale, frames }) => {
  const renderer = new Renderer(project);
  let status: RendererResult | undefined;
  renderer.onFinished.subscribe((result) => {
    status = result;
  });
  const last = Math.round(timeline.duration * fps) - 1;
  await renderer.render({
    ...project.meta.getFullRenderingSettings(),
    name: project.name,
    fps,
    range: [0, frames?.length ? Math.max(...frames) / fps : last / fps],
    size: new Vector2(canvas.width, canvas.height),
    resolutionScale: scale,
    colorSpace: 'srgb',
    exporter: { name: 'studio:png', options: frames },
  });
  if (status !== RendererResult.Success || errors.length) {
    throw new Error(`Motion Canvas no pudo renderizar: ${errors.join('; ') || status}`);
  }
};
