import type { Page } from '@playwright/test';

export const root: string;
export const localBrowsers: string;

export function withStudioBrowser<T>(
  run: (page: Page, url: string, version: string) => Promise<T>,
): Promise<T>;

export function openCapture(
  page: Page,
  url: string,
  onFrame: (frame: number, png: Buffer) => void | Promise<void>,
  productionId?: string,
): Promise<{ production: StudioProduction; capture: (options: StudioCapture) => Promise<void> }>;
