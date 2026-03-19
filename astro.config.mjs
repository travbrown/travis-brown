import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: "https://travisbrown.dev",
  build: {
    inlineStylesheets: "auto",
  },
  output: "hybrid",
  adapter: vercel(),
});
