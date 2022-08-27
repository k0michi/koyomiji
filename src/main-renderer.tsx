import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { Helmet } from 'react-helmet';
import { Root } from "./components/root.js";
import { Entry } from "./entry.js";
import { Renderer } from "./renderer.js";
import * as ktml from './ktml.js';
import * as fs from 'fs/promises';
import * as ReactKTML from './react-ktml.js';

export interface Registry {
  rootDir: string;
  entries: { [key: string]: Entry };
}

export function createRenderer(outRoot: string | null, template: string, registry: Registry) {
  const renderer = new Renderer(outRoot);

  renderer.use('/(index.html)?', (ctx) => {
    return render(<Root />, template, '/');
  });

  renderer.use('/about/(index.html)?', (ctx) => {
    return render(<Root />, template, '/about');
  });

  renderer.use('/project/(index.html)?', (ctx) => {
    return render(<Root />, template, '/project');
  });

  renderer.use('/knowledge/(index.html)?', (ctx) => {
    return render(<Root items={Object.values(registry.entries).filter(p => p.path[0] == 'knowledge').map(p => extractMeta(p))} />, template, '/knowledge');
  });

  renderer.use('/knowledge/:category/:id/(index.html)?', (ctx) => {
    const params = ctx.params as any;
    const id = params['id'] as string;
    const category = params['category'] as string;
    const path = ['knowledge', category, id];
    const entry = Object.values(registry.entries).find(p => compareArray(p.path, path));

    if (entry == undefined || entry.content == null) {
      throw new Error('Not found');
    }

    const { title, created, description } = entry;
    const body = ktml.toElement(entry.content.childNodes, ReactKTML.reactFactory);

    return render(
      <Root title={title} created={new Date(created)} id={id} category={category} description={description}>
        {body}
      </Root>
      , template, `/knowledge/${category}/${id}`
    );
  });

  renderer.use('/knowledge/:category/:id/entry.json', (ctx) => {
    const params = ctx.params as any;
    const id = params['id'] as string;
    const category = params['category'] as string;
    const path = ['knowledge', category, id];
    const entry = Object.values(registry.entries).find(p => compareArray(p.path, path));

    if (entry == undefined || entry.content == null) {
      throw new Error('Not found');
    }

    return JSON.stringify({ content: entry.content.outerHTML, ...entry });
  });

  renderer.use('/knowledge/:category/:id/:path*', (ctx) => {
    const params = ctx.params as any;
    return fs.readFile(`${registry.rootDir}/knowledge/${params.category}/${params.id}/${params.path.join('/')}`);
  });

  renderer.use('/log/(index.html)?', (ctx) => {
    return render(<Root items={Object.values(registry.entries).filter(p => p.path[0] == 'log').map(p => extractMeta(p))} />, template, '/log');
  });

  renderer.use('/log/:id/(index.html)?', (ctx) => {
    const params = ctx.params as any;
    const id = params['id'] as string;
    const path = ['log', id];
    const entry = Object.values(registry.entries).find(p => compareArray(p.path, path));

    if (entry == undefined || entry.content == null) {
      throw new Error('Not found');
    }

    const { title, created, description } = entry;
    const body = ktml.toElement(entry.content.childNodes, ReactKTML.reactFactory);

    return render(
      <Root title={title} created={new Date(created)} id={id} description={description}>
        {body}
      </Root>
      , template, `/log/${id}`
    );
  });

  renderer.use('/log/:id/entry.json', (ctx) => {
    const params = ctx.params as any;
    const id = params['id'] as string;
    const path = ['log', id];
    const entry = Object.values(registry.entries).find(p => compareArray(p.path, path));

    if (entry == undefined || entry.content == null) {
      throw new Error('Not found');
    }

    return JSON.stringify({ content: entry.content.outerHTML, ...entry });
  });

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
    .replace('<!--body-->', app)
    .replace('<!--hydration-data-->', JSON.stringify({ entries: [] }));
}

export function createEntry(entryPath: string[], content: string): Entry {
  const $document = ktml.parseXML(content);
  const $head = $document.querySelector('head');
  const title = ktml.getTextContent('title', $head);
  const created = ktml.getTextContent('created', $head);

  const $body = $document.querySelector('body')!;
  ktml.transformMath($body);
  ktml.transformCode($body);
  ktml.transformImg($body, entryPath);
  const description = ktml.getDescription($body, 120);
  return { title, created, description, path: entryPath, content: $body };
}

function compareArray<T>(a1: Array<T>, a2: Array<T>) {
  return a1.length == a2.length && a1.every((v, i) => v == a2[i]);
}

function extractMeta(entry: Entry) {
  const cloned = { ...entry };
  delete cloned.content;
  return cloned;
}