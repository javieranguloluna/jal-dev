import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  image: {
    domains: ["jal-dev.vercel.app"]
  },
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    }
  })
});