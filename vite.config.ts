import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, Plugin } from "vite";
import koyomijiReload from "./plugins/koyomiji-reload";

export default defineConfig({
  plugins: [
    reactRouter(),
    koyomijiReload()
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 5432
  }
});
