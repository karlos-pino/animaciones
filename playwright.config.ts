import { defineConfig } from '@playwright/test';

const url = 'http://127.0.0.1:9017';
export default defineConfig({
  testDir: './tests/visual',
  timeout: 90000,
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  snapshotPathTemplate: '{testDir}/__snapshots__/{testFileName}/{arg}{ext}',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: url,
    browserName: 'chromium',
    viewport: { width: 960, height: 540 },
    deviceScaleFactor: 1,
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
    colorScheme: 'light',
  },
  webServer: {
    command: 'pnpm --filter @studio/motion-studio dev --port 9017',
    url,
    reuseExistingServer: false,
    timeout: 30000,
  },
});
