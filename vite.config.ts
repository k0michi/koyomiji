import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, Plugin } from "vite";
import { ServerModel } from "./lib/server-model";
import koyomijiReload from "./plugins/koyomiji-reload";

export default defineConfig({
  plugins: [
    reactRouter({
      async prerender({ getStaticPaths }) {
        const staticPaths = getStaticPaths();
        const dynamicPaths = await ServerModel.instance.getDynamicPaths();
        return [...staticPaths, ...dynamicPaths];
      },
    }),
    tsconfigPaths(),
    koyomijiReload()
  ],
  server: {
    port: 5432
  }
});
