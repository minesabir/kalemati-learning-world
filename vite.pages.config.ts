import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "/kalemati-learning-world/",
  publicDir: "public",
  plugins: [react()],
  define: {
    __GITHUB_PAGES__: "true",
  },
  resolve: {
    alias: {
      "next/image": fileURLToPath(
        new URL("./github-pages/static-image.tsx", import.meta.url),
      ),
    },
  },
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
  },
});
