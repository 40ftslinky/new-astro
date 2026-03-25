// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://astro.40ftslinky.com',
  devToolbar: {
    enabled: false,
  },
  fonts: [
      {
        provider:fontProviders.fontsource(),
        name: 'Inter',
        cssVariable: '--font-inter',
        weights: [400, 500, 600, 700],
        fallbacks: ['sans-serif'],
      },
      {
        provider:fontProviders.fontsource(),
        name: 'Inter Tight',
        cssVariable: '--font-inter-tight',
        weights: [400, 500, 600, 700],
        fallbacks: ['sans-serif'],
      },
    ],

  // base: 'new-astro',
  // trailingSlash: 'always',
  experimental: {
      // svg: true,
      // responsiveImages: true,
  },

  integrations: [mdx()],
});