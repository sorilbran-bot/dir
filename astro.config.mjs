import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://detroitinnovationrecord.com', // keep in sync with src/site.config.ts
  trailingSlash: 'always',
  integrations: [sitemap()],
});
