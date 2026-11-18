import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'tests/unit/**/*.test.ts',
      'tests/render/**/*.test.mjs',
      'productions/**/tests/*.test.ts',
    ],
  },
});
