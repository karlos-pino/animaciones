import latinInter from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
import { type } from '../../../packages/design-tokens/src';

export async function loadStudioFont() {
  const font = new FontFace(type.family, `url("${latinInter}")`, { weight: '100 900' });
  document.fonts.add(await font.load());
}
