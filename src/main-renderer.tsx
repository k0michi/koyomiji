import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { Helmet } from 'react-helmet';
import { Root } from "./components/root.js";
import { Post } from "./post.js";
import { Context, Renderer } from "./renderer.js";
import * as ktml from './ktml.js';
import * as fs from 'fs/promises';

export interface Registry {
  rootDir: string;
  logItems: { [key: string]: Post };
  knowledgeItems: { [key: string]: Post };
}

export function createRenderer(outRoot: string | null, template: string, registry: Registry) {
  const renderer = new Renderer(outRoot);

  function indexPage(ctx: Context) {
    return render(<Root />, template, '/');
  }

  renderer.use('/index.html', indexPage);
  renderer.use('/', indexPage);

  function aboutPage(ctx: Context) {
    return render(<Root />, template, '/about');
  }

  renderer.use('/about/index.html', aboutPage);
  renderer.use('/about', aboutPage);

  function knowledgeIndexPage(ctx: Context) {
    return render(<Root items={Object.values(registry.knowledgeItems).map(p => p.head)} />, template, '/knowledge');
  }

  renderer.use('/knowledge/index.html', knowledgeIndexPage);
  renderer.use('/knowledge', knowledgeIndexPage);

  function knowledgePage(ctx: Context) {
    const params = ctx.params as any;
    const id = params['id'] as string;
    const category = params['category'] as string;
    const post = registry.knowledgeItems[[category, id].join('/')];
    const { title, created, description } = post.head;
    const body = ktml.toElement(post.body.childNodes);

    return render(
      <Root title={title} created={new Date(created)} id={id} category={category} description={description}>
        {body}
      </Root>
      , template, `/knowledge/${category}/${id}`);

  }

  renderer.use('/knowledge/:category/:id/index.html', knowledgePage);
  renderer.use('/knowledge/:category/:id', knowledgePage);

  renderer.use('/knowledge/:id/:path*', (ctx) => {
    const params = ctx.params as any;
    return fs.readFile(`${registry.rootDir}/knowledge/${params.category}/${params.id}/${params.path.join('/')}`);
  });

  function logIndexPage(ctx: Context) {
    return render(<Root items={Object.values(registry.logItems).map(p => p.head)} />, template, '/log');
  }

  renderer.use('/log/index.html', logIndexPage);
  renderer.use('/log', logIndexPage);

  function logPage(ctx: Context) {
    const params = ctx.params as any;
    const id = params['id'] as string;
    const post = registry.logItems[[id].join('/')];
    console.log(ctx)
    const { title, created, description } = post.head;
    const body = ktml.toElement(post.body.childNodes);

    return render(
      <Root title={title} created={new Date(created)} id={id} description={description}>
        {body}
      </Root>
      , template, `/log/${id}`)
  }

  renderer.use('/log/:id/index.html', logPage);
  renderer.use('/log/:id', logPage);

  renderer.use('/log/:id/:path*', (ctx) => {
    const params = ctx.params as any;
    return fs.readFile(`${registry.rootDir}/log/${params.id}/${params.path.join('/')}`);
  });

  return renderer;
}

export function render(children: any, template: string, pathname: string) {
  const app = ReactDOM.renderToString(
    <StaticRouter location={pathname}>
      {children}
    </StaticRouter>
  );
  const helmet = Helmet.renderStatic();
  return template
    .replace('<!--head-->', [helmet.title.toString(), helmet.meta.toString(), helmet.link.toString()].join('\n'))
    .replace('<!--body-->', app);
}

export function createPost(content: string, id: string, basePath: string[], category?: string): Post {
  const $document = ktml.parseXML(content);
  const $head = $document.querySelector('head');
  const title = ktml.getTextContent('title', $head);
  const created = ktml.getTextContent('created', $head);

  const $body = $document.querySelector('body')!;
  ktml.transformMath($body);
  ktml.transformCode($body);
  ktml.transformImg($body, basePath);
  const description = ktml.getDescription($body, 120);
  const head = { title, created, description, id, category };
  return { head, body: $body };
}