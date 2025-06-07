import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, Plugin } from "vite";
import koyomijiReload from "./plugins/koyomiji-reload";

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    koyomijiReload()
  ],
  server: {
    port: 5432
  }
});
