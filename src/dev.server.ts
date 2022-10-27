import Koa from 'koa';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import koaConnect from 'koa-connect';
import * as fs from 'fs/promises';
import * as path from 'path';
import glob from 'glob-promise';
import * as chokidar from 'chokidar';
import { AddressInfo } from 'net';
import { ServerModel } from './server-model.js';
import { installGlobals } from '@remix-run/node';

installGlobals();

const contentRoot = './contents';

const model = new ServerModel(contentRoot);

async function createServer() {
  const app = new Koa();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  app.use(koaConnect(vite.middlewares));

  app.use(async (ctx) => {
    let url = ctx.originalUrl;

    try {
      let template = await fs.readFile(
        path.resolve('index.html'),
        'utf-8'
      );

      template = await vite.transformIndexHtml(url, template)

      const { createRenderer } = await vite.ssrLoadModule('/src/renderer.tsx')
      const renderer = createRenderer(null, template, model);
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
      console.log(`Serving on http://${address}:${port}`);
      resolve(server);
    });

    server.on('error', e => {
      reject(e);
    })
  });
}

async function loadFile(p: string) {
  if (p.endsWith('index.ktml')) {
    await model.loadEntry(p);
    console.log(`'${p}' has been loaded`);
    return true;
  } else if (p.endsWith('index.kdml')) {
    await model.loadDictionary(p);
    console.log(`'${p}' has been loaded`);
    return true;
  }

  return false;
}

async function compileFile(p: string) {
  if (p.endsWith('index.md')) {
    await model.compileEntry(p);
    console.log(`'${p}' has been loaded`);
  }
}

async function prepare() {
  for (const p of await glob('**/*', { cwd: contentRoot, nodir: true })) {
    loadFile(p);
  }
}

function registerHandler(vite: ViteDevServer) {
  chokidar.watch('.', { cwd: contentRoot }).on('all', async (event, p) => {
    try {
      if (event == 'change') {
        if (await loadFile(p)) {
          vite.ws.send({ type: 'full-reload' });
        } else {
          compileFile(p);
        }
      }
    } catch (e) {
      console.log(e);
    }
  });
}

(async () => {
  await prepare();
  const { vite } = await createServer();
  registerHandler(vite);
})();