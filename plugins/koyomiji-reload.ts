import { Plugin, ViteDevServer } from "vite";
import * as chokidar from 'chokidar';
import { ServerModel } from "../lib/server-model";

export default function koyomijiReload() {
  return (new KoyomijiReload()).getPlugin();
}

class KoyomijiReload {
  server?: ViteDevServer;
  watcher?: chokidar.FSWatcher;

  constructor() {
  }

  getPlugin(): Plugin {
    return {
      name: 'koyomiji-reload',
      apply: 'serve',
      configureServer: this.configureServer.bind(this),
      buildEnd: this.buildEnd.bind(this),
    };
  }

  configureServer(server: ViteDevServer) {
    this.server = server;
    this.initialize();
  }

  buildEnd() {
    this.finalize();
  }

  initialize() {
    // console.log(this.server?.config)
    // this.watcher = chokidar.watch('.', { cwd: ServerModel.instance.rootDir }).on('all', async (event, path) => {
    //   try {
    // console.log(event, path);
    // if (event == 'change') {
    //   if (await loadFile(p)) {
    //     vite.ws.send({ type: 'full-reload' });
    //   } else {
    //     compileFile(p);
    //   }
    // }
    // } catch (e) {
    // }
    // });
  }

  finalize() {
    this.watcher?.close();
  }
}