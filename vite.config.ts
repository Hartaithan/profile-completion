import tailwindcss from "@tailwindcss/vite";
import ssl from "@vitejs/plugin-basic-ssl";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss(), ssl()],
  server: {
    host: "local.hartaithan.com",
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
