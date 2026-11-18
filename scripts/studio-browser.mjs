import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { startStudio } from '../apps/motion-studio/server.mjs';
import { defaultProduction, root } from './production.mjs';

export { root };
export const localBrowsers = fileURLToPath(new URL('../.tools/browsers', import.meta.url));

export async function withStudioBrowser(run) {
  if (existsSync(localBrowsers)) process.env.PLAYWRIGHT_BROWSERS_PATH ??= localBrowsers;
  const { chromium } = await import('@playwright/test');
  const studio = await startStudio();
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: { width: 960, height: 540 },
      deviceScaleFactor: 1,
    });
    return await run(page, studio.url, browser.version());
  } finally {
    try {
      await browser?.close();
    } finally {
      await studio.close();
    }
  }
}

export async function openCapture(page, url, onFrame, productionId = defaultProduction) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.exposeFunction('studioFrame', (frame, png) =>
    onFrame(frame, Buffer.from(png, 'base64')),
  );
  await page.goto(`${url}/capture.html?production=${encodeURIComponent(productionId)}`);
  try {
    await page.waitForFunction(() => Boolean(window.captureStudio), undefined, { timeout: 15000 });
  } catch (error) {
    throw new Error(
      `No se abrió el adaptador de Motion Canvas: ${errors.join('; ') || error.message}`,
      { cause: error },
    );
  }
  const production = await page.evaluate(() => window.studioProduction);
  return {
    production,
    async capture(options) {
      await page.evaluate((settings) => window.captureStudio(settings), options);
      if (errors.length) throw new Error(errors.join('; '));
    },
  };
}
