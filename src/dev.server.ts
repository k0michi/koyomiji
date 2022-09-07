import Koa from 'koa';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import koaConnect from 'koa-connect';
import * as fs from 'fs/promises';
import * as path from 'path';
import glob from 'glob-promise';
import * as chokidar from 'chokidar';
import { AddressInfo } from 'net';
import { ServerModel } from './server-model.js';

const contentRoot = './contents';

const model = new ServerModel(contentRoot);

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
      console.log(`http://${address}:${port}`);
      resolve(server);
    });

    server.on('error', e => {
      reject(e);
    })
  });
}

async function processFile(p: string) {
  if (p.endsWith('index.ktml')) {
    await model.loadEntry(p);
    console.log(new Date(), p)
    return true;
  } else if (p.endsWith('index.kdml')) {
    await model.addDictionary(p);
    console.log(new Date(), p)
    return true;
  }

  return false;
}

async function prepare() {
  for (const p of await glob('**/*', { cwd: contentRoot, nodir: true })) {
    processFile(p);
  }
}

function registerHandler(vite: ViteDevServer) {
  chokidar.watch('.', { cwd: 'contents' }).on('all', async (event, p) => {
    try {
      if (event == 'change') {
        if (await processFile(p)) {
          vite.ws.send({ type: 'full-reload' });
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