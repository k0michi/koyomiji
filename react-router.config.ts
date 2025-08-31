import type { Config } from "@react-router/dev/config";
import ServerModel from "./lib/ServerModel";

const isDev = process.env.NODE_ENV === "development";

export default {
  ssr: isDev,
  async prerender({ getStaticPaths }) {
    const staticPaths = getStaticPaths();
    const dynamicPaths = await ServerModel.instance.getDynamicPaths();
    return [...staticPaths, ...dynamicPaths];
  },
} satisfies Config;
