import Koa from 'koa';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import koaConnect from 'koa-connect';
import * as fs from 'fs/promises';
import * as path from 'path';
import glob from 'glob-promise';
import { createEntry, Registry } from './main-renderer.js';
import { readText, toPathname } from './utils.js';
import * as chokidar from 'chokidar';
import { AddressInfo } from 'net';

const contentRoot = './contents';

const registry: Registry = {
  rootDir: contentRoot,
  entries: {}
};

async function createServer() {
  const app = new Koa();
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })

  app.use(koaConnect(vite.middlewares));

  app.use(async (ctx) => {
    let url = ctx.originalUrl;

    try {
      console.log(url)
      let template = await fs.readFile(
        path.resolve('index.html'),
        'utf-8'
      )

      template = await vite.transformIndexHtml(url, template)

      const { createRenderer } = await vite.ssrLoadModule('/src/main-renderer.tsx')
      const renderer = createRenderer(null, template, registry);
      const html = await renderer.renderToString(url);

      ctx.type = 'text/html';
      ctx.body = html;
    } catch (e: any) {
      vite.ssrFixStacktrace(e)
      ctx.throw(500, e.stack)
    }
  });

  try {
    await listen(app, 3000);
  } catch (e) {
    if ((e as any).code == 'EADDRINUSE') {
      await listen(app, 0);
    }
  }

  return { vite, app };
}

async function listen(app: Koa, port: number) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      const info = server.address() as AddressInfo;
      const address = info.address == '::' ? 'localhost' : info.address;
      const port = info.port;
      console.log(`http://${address}:${port}`);
      resolve(server);
    });

    server.on('error', e => {
      reject(e);
    })
  });
}

async function readEntry(p: string) {
  const entryPath = p.split('/').slice(0, -1);
  const content = await readText(path.join(contentRoot, p));
  return createEntry(entryPath, content);
}

async function prepare() {
  for (const p of await glob('**/*', { cwd: contentRoot, nodir: true })) {
    if (p.endsWith('index.ktml')) {
      const entryPath = p.split('/').slice(0, -1);
      registry.entries[toPathname(entryPath)] = await readEntry(p);
    }
  }
}

function registerHandler(vite: ViteDevServer) {
  chokidar.watch('.', { cwd: 'contents' }).on('all', async (event, p) => {
    if (event == 'change') {
      if (p.endsWith('index.ktml')) {
        const entryPath = p.split('/').slice(0, -1);
        registry.entries[toPathname(entryPath)] = await readEntry(p);

        vite.ws.send({ type: 'full-reload' });
        console.log(new Date(), event, p)
      }
    }
  });
}

(async () => {
  await prepare();
  const { vite } = await createServer();
  registerHandler(vite);
})();