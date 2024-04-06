import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue2";
//import VitePluginVue2Suffix from "vite-plugin-vue2-suffix";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080, // Elige el puerto que desees
  },
  global: {},
  resolve: {
    alias: {
      // "@" -> "/User/project-root/src/views"
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
