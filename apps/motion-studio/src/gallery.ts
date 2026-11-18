import { makeProject } from '@motion-canvas/core';
import { loadStudioFont } from './font';
import primitives from './scenes/primitives?scene';
import patterns from './scenes/patterns?scene';

await loadStudioFont();
export default makeProject({ scenes: [primitives, patterns] });
