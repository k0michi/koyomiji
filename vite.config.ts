import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, Plugin } from "vite";
import { ServerModel } from "./lib/server-model";
import koyomijiReload from "./plugins/koyomiji-reload";

let serverModel = new ServerModel('contents');

export default defineConfig({
  plugins: [
    reactRouter({
      async prerender({ getStaticPaths }) {
        const staticPaths = getStaticPaths();
        const dynamicPaths = await serverModel.getDynamicPaths();
        return [...staticPaths, ...dynamicPaths];
      },
    }),
    tsconfigPaths(),
    koyomijiReload()
  ],
});
