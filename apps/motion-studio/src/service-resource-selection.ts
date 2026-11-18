import { makeProject } from '@motion-canvas/core';
import selection from '../../../productions/service-resource-selection/scenes/selection?scene';
import { loadStudioFont } from './font';

await loadStudioFont();
export default makeProject({ name: 'service-resource-selection', scenes: [selection] });
