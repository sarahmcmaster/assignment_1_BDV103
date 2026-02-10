import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    //consider all src/ files as part of test
    includeSource: ['src/**/*.{js,ts}'],
    setupFiles: ['./database_test_setup.ts'],
  },
});
