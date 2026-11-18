import { createRequire } from 'node:module';
import { defineConfig } from 'vite';

// The plugin publishes a CommonJS module with an exports.default property.
const { default: motionCanvas } = createRequire(import.meta.url)(
  '@motion-canvas/vite-plugin',
) as typeof import('@motion-canvas/vite-plugin');

export default defineConfig({
  plugins: [
    motionCanvas({
      project: ['./src/service-resource-selection.ts', './src/gallery.ts', './src/smoke.ts'],
    }),
  ],
  optimizeDeps: {
    include: [
      '@motion-canvas/core',
      '@motion-canvas/2d',
      '@motion-canvas/2d/lib/jsx-dev-runtime',
      '@motion-canvas/ui',
    ],
  },
  server: { host: '127.0.0.1', port: 9000, strictPort: true },
});
