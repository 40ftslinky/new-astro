// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://40ftslinky.github.io',

  // base: 'new-astro',
  // trailingSlash: 'always',
  experimental: {
      svg: true,
  },

  integrations: [mdx()],
});