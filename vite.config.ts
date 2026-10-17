import { defineConfig } from 'vitest/config';
import preact from '@preact/preset-vite';

export default defineConfig({
  // Relative URLs so the build runs from any static host path (e.g. GitHub Pages).
  base: './',
  plugins: [preact()],
  test: {
    environment: 'jsdom',
  },
});
