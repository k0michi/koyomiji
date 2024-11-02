import { Plugin, ViteDevServer } from "vite";
import * as chokidar from 'chokidar';
import { ServerModel } from "../lib/server-model";
import PathHelper from "../lib/PathHelper";

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
    this.log("Initializing");

    this.watcher = chokidar.watch('.', { cwd: ServerModel.instance.rootDir }).on('all', async (event, path) => {
      try {
        if (event == 'change') {
          if (PathHelper.endsWith(path, 'index.ktml')) {
            this.log(`Reloading ${path}`);
            await ServerModel.instance.loadEntry(path);
            this.server?.ws.send('koyomiji:update', {});
          } else if (PathHelper.endsWith(path, 'index.md')) {
            this.log(`Compiling ${path}`);
            await ServerModel.instance.compileMarkdown(path);
            // this.server?.ws.send('koyomiji:update', {});
          }
        }
      } catch (e) {
        this.log(e);
      }
    });
  }

  finalize() {
    this.log("Finalizing");
    this.watcher?.close();
  }

  log(...args: any) {
    console.log(`[Koyomiji|${new Date().toLocaleString()}]`, ...args);
  }
}