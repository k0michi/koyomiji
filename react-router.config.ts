import type { Config } from "@react-router/dev/config";
import ServerModel from "./lib/ServerModel";

export default {
  ssr: false,
  async prerender({ getStaticPaths }) {
    const staticPaths = getStaticPaths();
    const dynamicPaths = await ServerModel.instance.getDynamicPaths();
    return [...staticPaths, ...dynamicPaths];
  },
} satisfies Config;
