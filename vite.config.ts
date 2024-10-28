import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";
import { ServerModel } from "./lib/server-model";

let serverModel = new ServerModel('contents');

export default defineConfig({
  plugins: [
    reactRouter({
      async prerender({ getStaticPaths }) {
        const staticPaths = getStaticPaths();
        return [...staticPaths];
      },
    }), , tsconfigPaths()],
});
