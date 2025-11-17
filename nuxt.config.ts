import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  builder: "vite",
  devtools: { enabled: true },
  ssr: true,
  modules: ["@wagmi/vue/nuxt"],
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
      hmr: {
        protocol: "ws",
        host: "localhost",
        overlay: true,
      },
    },
    plugins: [tailwindcss() as any],
    optimizeDeps: {
      include: ["@wagmi/vue", "@tanstack/vue-query", "viem"],
    },
    build: {
      rollupOptions: {
        external: [],
      },
    },
  },
  css: ["@/assets/css/main.css"],
  devServer: {
    host: "localhost",
    port: 4000,
  },
});
