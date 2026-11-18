import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/output/**',
      '**/.tools/**',
      '**/test-results/**',
      '**/playwright-report/**',
    ],
  },
  ...tseslint.configs.recommended,
);
