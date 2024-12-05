import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  },
});

// https://stackoverflow.com/questions/73392328/vs-code-showing-eslint-error-but-vitest-is-working-vi-is-not-defined

// With the eslint new flat config (eslint.config.js), this is the way:
// import vitest from '@vitest/eslint-plugin';
// ...
// {
//     files: '**/__tests__/**/*.whatever.[jt]s',
//     plugins: {
//         vitest
//     },
//     languageOptions: {
//         globals: {
//             ...vitest.environments.env.globals
//         }
//     },
//     rules: {
//         ...vitest.configs.recommended.rules
//     }
// }
