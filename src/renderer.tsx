import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { ModelProvider } from 'kyoka';
import * as fs from 'fs/promises';
import produce from 'immer';
import window from '@k0michi/isomorphic-dom';

import Root from "./root.js";
import { Renderer } from "./base/renderer.js";
import { InitialData, Model } from './model.js';
import { toPathname } from './utils.js';
import { ServerModel } from './server-model.js';
import { toISOStringJST } from './date-format.js';
import { newElementCreator } from './xml.js';
import { createMemoryRouter, createRoutesFromElements, RouterProvider } from 'react-router';

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
    model.sitemap.add('/');
    return render(template, '/', { entries: getEntries(), isIndexComplete: true });
  });

  renderer.use('/about/(index.html)?', (ctx) => {
    model.sitemap.add('/about');
    return render(template, '/about');
  });

  renderer.use('/project/(index.html)?', (ctx) => {
    model.sitemap.add('/project');
    return render(template, '/project');
  });

  renderer.use('/knowledge/(index.html)?', (ctx) => {
    model.sitemap.add('/knowledge');
    return render(template, '/knowledge', { entries: getEntries(), isIndexComplete: true });
  });

  renderer.use('/knowledge/:category/:id/(index.html)?', (ctx) => {
    const pathname = toPathname(['knowledge', ctx.params['category'], ctx.params['id']])
    const entry = model.getEntry(pathname);
    model.sitemap.add(pathname, entry.modified);

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
    model.sitemap.add('/log');
    return render(template, '/log', { entries: getEntries(), isIndexComplete: true });
  });

  renderer.use('/log/:id/(index.html)?', (ctx) => {
    const pathname = toPathname(['log', ctx.params['id']]);
    const entry = model.getEntry(pathname);
    model.sitemap.add(pathname, entry.modified);

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
    model.sitemap.add('/novel');
    return render(template, '/novel', { entries: getEntries(), isIndexComplete: true });
  });

  renderer.use('/novel/:novel/:chapter/(index.html)?', (ctx) => {
    const pathname = toPathname(['novel', ctx.params['novel'], ctx.params['chapter']]);
    const entry = model.getEntry(pathname);
    model.sitemap.add(pathname, entry.modified);

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
    model.sitemap.add('/artwork');
    return render(template, '/artwork', { entries: getEntries(), isIndexComplete: true });
  });

  renderer.use('/artwork/:id/(index.html)?', (ctx) => {
    const pathname = toPathname(['artwork', ctx.params['id']]);
    const entry = model.getEntry(pathname);
    model.sitemap.add(pathname, entry.modified);

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

  renderer.use('/dictionary/(index.html)?', (ctx) => {
    model.sitemap.add('/dictionary');
    return render(template, '/dictionary');
  });

  renderer.use('/dictionary/data.json', (ctx) => {
    return JSON.stringify(model.dictionaries);
  });

  renderer.use('/feed.xml', (ctx) => {
    const atomNS = 'http://www.w3.org/2005/Atom';
    const document = window.document.implementation.createDocument(atomNS, 'feed');
    const create = newElementCreator(document, atomNS);
    const feed = document.firstChild! as Element;

    feed.appendChild(create('title', {}, '喫茶曆路'));
    feed.appendChild(create('id', {}, 'urn:uuid:7e260dae-5479-45c2-bad8-0be227c48ab8'));
    feed.appendChild(create('link', { rel: 'self', href: 'https://koyomiji.com/feed.xml' }));
    feed.appendChild(create('link', { rel: 'alternate', href: 'https://koyomiji.com/' }));
    feed.appendChild(create('updated', {}, toISOStringJST(new Date())));
    feed.appendChild(create('icon', {}, 'https://koyomiji.com/favicon.ico'));

    const author = create('author');
    author.appendChild(create('name', {}, 'Komichi'));
    author.appendChild(create('email', {}, 'k0michi@koyomi.co'));
    feed.appendChild(author);

    for (const e of Object.values(model.entries)) {
      const entry = create('entry');
      entry.appendChild(create('title', {}, e.title));
      entry.appendChild(create('summary', {}, e.description));
      entry.appendChild(create('id', {}, `urn:uuid:${e.id}`));
      entry.appendChild(create('link', { rel: 'alternate', href: new URL(toPathname(e.path), 'https://koyomiji.com/').toString() }));
      entry.appendChild(create('published', {}, e.created));
      entry.appendChild(create('updated', {}, e.modified));
      feed.appendChild(entry);
    }

    const serializer = new window.XMLSerializer();
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(feed);
  });

  renderer.use('/sitemap.xml', (ctx) => {
    return model.sitemap.toXML();
  });

  return renderer;
}

function render(template: string, pathname: string, data: InitialData = { entries: {}, isIndexComplete: false }) {
  const model = new Model(data);

  const router = createMemoryRouter(createRoutesFromElements(Root({})), {
    initialEntries: [pathname],
    initialIndex: 0
  });

  const app = ReactDOM.renderToString(
    <ModelProvider model={model}>
      <RouterProvider router={router} />
    </ModelProvider>
  );

  const helmet = Helmet.renderStatic();

  return template
    .replace('<body>', `<body ${helmet.bodyAttributes.toString()}>`)
    .replace('<!--head-->', [helmet.title.toString(), helmet.meta.toString(), helmet.link.toString()].join('\n'))
    .replace('<!--body-->', app)
    .replace('<!--initial-data-->', JSON.stringify(data));
}