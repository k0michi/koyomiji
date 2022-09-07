import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { Helmet } from 'react-helmet';
import { ModelProvider } from 'kyoka';
import * as fs from 'fs/promises';
import produce from 'immer';

import Root from "./components/root.js";
import { Renderer } from "./base/renderer.js";
import { InitialData, Model } from './model.js';
import { toPathname } from './utils.js';
import { ServerModel } from './server-model.js';

export function createRenderer(outRoot: string | null, template: string, model: ServerModel) {
  const renderer = new Renderer(outRoot);

  function getEntries() {
    const entries = produce(model.entries, draft => {
      for (const entry of Object.values(draft)) {
        delete entry.content;
      }
    });

    return entries;
  }

  renderer.use('/(index.html)?', (ctx) => {
    return render(template, '/');
  });

  renderer.use('/about/(index.html)?', (ctx) => {
    return render(template, '/about');
  });

  renderer.use('/project/(index.html)?', (ctx) => {
    return render(template, '/project');
  });

  renderer.use('/knowledge/(index.html)?', (ctx) => {
    return render(template, '/knowledge', { entries: getEntries(), isIndexComplete: true });
  });

  renderer.use('/knowledge/:category/:id/(index.html)?', (ctx) => {
    const pathname = toPathname(['knowledge', ctx.params['category'], ctx.params['id']])
    const entry = model.getEntry(pathname);

    const initialData: InitialData = { entries: {}, isIndexComplete: false };
    initialData.entries[pathname] = entry;
    return render(template, pathname, initialData);
  });

  renderer.use('/knowledge/:category/:id/entry.json', (ctx) => {
    const pathname = toPathname(['knowledge', ctx.params['category'], ctx.params['id']])
    const entry = model.getEntry(pathname);

    return JSON.stringify(entry);
  });

  renderer.use('/knowledge/:category/:id/:path*', (ctx) => {
    return fs.readFile(`${model.rootDir}/knowledge/${ctx.params.category}/${ctx.params.id}/${ctx.params.path.join('/')}`);
  });

  renderer.use('/log/(index.html)?', (ctx) => {
    return render(template, '/log', { entries: getEntries(), isIndexComplete: true });
  });

  renderer.use('/log/:id/(index.html)?', (ctx) => {
    const pathname = toPathname(['log', ctx.params['id']]);
    const entry = model.getEntry(pathname);

    const initialData: InitialData = { entries: {}, isIndexComplete: false };
    initialData.entries[pathname] = entry;
    return render(template, pathname, initialData);
  });

  renderer.use('/log/:id/entry.json', (ctx) => {
    const pathname = toPathname(['log', ctx.params['id']]);
    const entry = model.getEntry(pathname);

    return JSON.stringify(entry);
  });

  renderer.use('/log/:id/:path*', (ctx) => {
    return fs.readFile(`${model.rootDir}/log/${ctx.params.id}/${ctx.params.path.join('/')}`);
  });

  renderer.use('/entries.json', (ctx) => {
    return JSON.stringify(getEntries());
  });

  renderer.use('/novel/(index.html)?', (ctx) => {
    return render(template, '/novel');
  });

  renderer.use('/novel/:novel/:chapter/(index.html)?', (ctx) => {
    const pathname = toPathname(['novel', ctx.params['novel'], ctx.params['chapter']]);
    const entry = model.getEntry(pathname);

    const initialData: InitialData = { entries: {}, isIndexComplete: false };
    initialData.entries[pathname] = entry;
    return render(template, pathname, initialData);
  });

  renderer.use('/novel/:novel/:chapter/entry.json', (ctx) => {
    const pathname = toPathname(['novel', ctx.params['novel'], ctx.params['chapter']]);
    const entry = model.getEntry(pathname);

    return JSON.stringify(entry);
  });

  renderer.use('/artwork/(index.html)?', (ctx) => {
    return render(template, '/artwork');
  });

  renderer.use('/artwork/:id/(index.html)?', (ctx) => {
    const pathname = toPathname(['artwork', ctx.params['id']]);
    const entry = model.getEntry(pathname);

    const initialData: InitialData = { entries: {}, isIndexComplete: false };
    initialData.entries[pathname] = entry;
    return render(template, pathname, initialData);
  });

  renderer.use('/artwork/:id/entry.json', (ctx) => {
    const pathname = toPathname(['artwork', ctx.params['id']]);
    const entry = model.getEntry(pathname);

    return JSON.stringify(entry);
  });

  renderer.use('/artwork/:id/:path*', (ctx) => {
    return fs.readFile(`${model.rootDir}/artwork/${ctx.params.id}/${ctx.params.path.join('/')}`);
  });

  /*
  renderer.use('/dictionary/(index.html)?', (ctx) =>{ 
  });

  renderer.use('/dictionary/entries.json', (ctx) =>{ 
  });
  */

  return renderer;
}

function render(template: string, pathname: string, data: InitialData = { entries: {}, isIndexComplete: false }) {
  const model = new Model(data);

  const app = ReactDOM.renderToString(
    <StaticRouter location={pathname}>
      <ModelProvider model={model}>
        <Root />
      </ModelProvider>
    </StaticRouter>
  );

  const helmet = Helmet.renderStatic();

  return template
    .replace('<body>', `<body ${helmet.bodyAttributes.toString()}>`)
    .replace('<!--head-->', [helmet.title.toString(), helmet.meta.toString(), helmet.link.toString()].join('\n'))
    .replace('<!--body-->', app)
    .replace('<!--initial-data-->', JSON.stringify(data));
}