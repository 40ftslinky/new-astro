// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://40ftslinky.com',
  compressHTML: true,
  devToolbar: {
    enabled: false,
  },
  fonts: [
      // {
      //   provider:fontProviders.fontsource(),
      //   name: 'Inter',
      //   cssVariable: '--font-inter',
      //   weights: [400, 500, 600, 700],
      //   fallbacks: ['sans-serif'],
      // },
      // {
      //   provider:fontProviders.fontsource(),
      //   name: 'Inter Tight',
      //   cssVariable: '--font-inter-tight',
      //   weights: [400, 500, 600, 700],
      //   fallbacks: ['sans-serif'],
      // },
      {
        provider:fontProviders.fontsource(),
        name: 'Bricolage Grotesque',
        cssVariable: '--font-bricolage-grotesque',
        weights: [400, 500, 600, 700, 800],
        fallbacks: ['sans-serif'],
      },
      {
        provider:fontProviders.fontsource(),
        name: 'DM Sans',
        cssVariable: '--font-dm-sans',
        weights: [400, 500, 600, 700, 800],
        fallbacks: ['sans-serif'],
      },
      // {
      //   provider:fontProviders.fontsource(),
      //   name: 'Ultra',
      //   cssVariable: '--font-ultra',
      //   weights: [400],
      //   fallbacks: ['serif'],
      // },
      // {
      //   provider: fontProviders.adobe({ id: 'vds2fdi' }),
      //   name: 'Decoy',
      //   cssVariable: '--font-decoy',
      //   weights: [400, 700, 800],
      //   styles: ['normal', 'italic'],
      //   fallbacks: ['serif'],
      // },
      {
        provider: fontProviders.local(),
        name: 'Champ',
        cssVariable: '--font-champ',
        options: {
          variants: [
            {
              weight: 500,
              style: 'normal',
              src: ["./src/assets/fonts/Champ-Medium.otf"]
            },
            {
              weight: 800,
              style: 'normal',
              src: ["./src/assets/fonts/Champ-ExtraBold.otf"]
            },
            {
              weight: 900,
              style: 'normal',
              src: ["./src/assets/fonts/Champ-Black.woff"]
            }
            // ...
          ]
        }
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
