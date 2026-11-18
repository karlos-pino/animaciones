import briefYaml from '../brief.yaml?raw';
import storyboardYaml from '../storyboard.yaml?raw';
import { getTimeline, parseProduction } from '../../../packages/validation/src';

export const { brief, storyboard } = parseProduction(briefYaml, storyboardYaml);
export const timeline = getTimeline(storyboard);
export const posterId = '07-resultado';

export function moment(id: string) {
  const scene = storyboard.scenes.find((scene) => scene.id === id);
  if (!scene) throw new Error(`Momento ausente del storyboard: ${id}`);
  return scene;
}
