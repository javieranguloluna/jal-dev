import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  image: {
    domains: ["jal-dev.vercel.app"]
  },
  output: "hybrid",
  adapter: vercel(
    {
      "routes": [
        { handle: "filesystem" },
        { 
          src: "/(.*)",
          status: 404,
          methods: ["GET"],
          dest: "/404.html"
        }
      ]
    }
  )
});