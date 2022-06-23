import Koa from 'koa';
import { createServer as createViteServer } from 'vite';
import koaConnect from 'koa-connect';
import * as fs from 'fs/promises';
import * as path from 'path';

async function createServer() {
  const app = new Koa();
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })

  app.use(koaConnect(vite.middlewares));

  app.use(async (ctx) => {
    const url = ctx.originalUrl;

    try {
      let template = await fs.readFile(
        path.resolve('index.html'),
        'utf-8'
      )

      template = await vite.transformIndexHtml(url, template)

      //const { render } = await vite.ssrLoadModule('/src/entry-server.js')

      //const appHtml = await render(url)

      //const html = template.replace(`<!--ssr-outlet-->`, appHtml)
      const html = template;
      ctx.type = 'text/html';
      ctx.body = html;
    } catch (e: any) {
      vite.ssrFixStacktrace(e)
      ctx.throw(500, e.stack)
    }
  });


  setInterval(() => {
    vite.ws.send({ type: 'full-reload' });
  }, 10000)

  app.listen(3000, () => {
    console.log('listening')
  });
}

createServer()