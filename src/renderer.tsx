import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { ModelProvider } from 'kyoka';
import * as fs from 'fs/promises';
import produce from 'immer';
import window from '@k0michi/isomorphic-dom';

import { Renderer } from "./base/renderer.js";
import { Data, Model } from './model.js';
import { toPathname } from './utils.js';
import { ServerModel } from './server-model.js';
import { toISOStringJST } from './date-format.js';
import { newElementCreator } from './xml.js';
import { createMemoryRouter, createRoutesFromElements, RouterProvider } from 'react-router';
import { createRoutes } from './routes.js';

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
    return render(template, '/', '/', { entries: getEntries(), isIndexComplete: true });
  });

  renderer.use('/about/(index.html)?', (ctx) => {
    model.sitemap.add('/about');
    return render(template, '/about', '/about');
  });

  renderer.use('/project/(index.html)?', (ctx) => {
    model.sitemap.add('/project');
    return render(template, '/project', '/project');
  });

  renderer.use('/reference/(index.html)?', (ctx) => {
    model.sitemap.add('/reference');
    return render(template, '/reference', '/reference', { entries: getEntries(), isIndexComplete: true });
  });

  renderer.use('/reference/:category/:id/(index.html)?', (ctx) => {
    const pathname = toPathname(['reference', ctx.params['category'], ctx.params['id']]);
    const entry = model.getEntry(pathname);
    model.sitemap.add(pathname, entry.modified);

    const initialData: Data = { entries: {}, isIndexComplete: false };
    initialData.entries[pathname] = entry;
    return render(template, pathname, '/reference/:category/:id', initialData);
  });

  renderer.use('/reference/:category/:id/data.json', (ctx) => {
    const pathname = toPathname(['reference', ctx.params['category'], ctx.params['id']]);
    const entry = model.getEntry(pathname);
    const data = {entries: {
      [pathname]: entry
    }};

    return JSON.stringify(data);
  });

  renderer.use('/reference/:category/:id/:path*', (ctx) => {
    return fs.readFile(`${model.rootDir}/reference/${ctx.params.category}/${ctx.params.id}/${ctx.params.path.join('/')}`);
  });

  renderer.use('/log/(index.html)?', (ctx) => {
    model.sitemap.add('/log');
    return render(template, '/log', '/log', { entries: getEntries(), isIndexComplete: true });
  });

  renderer.use('/log/:id/(index.html)?', (ctx) => {
    const pathname = toPathname(['log', ctx.params['id']]);
    const entry = model.getEntry(pathname);
    model.sitemap.add(pathname, entry.modified);

    const initialData: Data = { entries: {}, isIndexComplete: false };
    initialData.entries[pathname] = entry;
    return render(template, pathname, '/log/:id', initialData);
  });

  renderer.use('/log/:id/data.json', (ctx) => {
    const pathname = toPathname(['log', ctx.params['id']]);
    const entry = model.getEntry(pathname);
    const data = {entries: {
      [pathname]: entry
    }};

    return JSON.stringify(data);
  });

  renderer.use('/log/:id/:path*', (ctx) => {
    return fs.readFile(`${model.rootDir}/log/${ctx.params.id}/${ctx.params.path.join('/')}`);
  });

  renderer.use('/data.json', (ctx) => {
    return JSON.stringify({entries: getEntries()});
  });

  renderer.use('/novel/(index.html)?', (ctx) => {
    model.sitemap.add('/novel');
    return render(template, '/novel', '/novel', { entries: getEntries(), isIndexComplete: true });
  });

  renderer.use('/novel/:novel/:chapter/(index.html)?', (ctx) => {
    const pathname = toPathname(['novel', ctx.params['novel'], ctx.params['chapter']]);
    const entry = model.getEntry(pathname);
    model.sitemap.add(pathname, entry.modified);

    const initialData: Data = { entries: {}, isIndexComplete: false };
    initialData.entries[pathname] = entry;
    return render(template, pathname, '/novel/:novel/:chapter', initialData);
  });

  renderer.use('/novel/:novel/:chapter/data.json', (ctx) => {
    const pathname = toPathname(['novel', ctx.params['novel'], ctx.params['chapter']]);
    const entry = model.getEntry(pathname);
    const data = {entries: {
      [pathname]: entry
    }};

    return JSON.stringify(data);
  });

  renderer.use('/artwork/(index.html)?', (ctx) => {
    model.sitemap.add('/artwork');
    return render(template, '/artwork', '/artwork', { entries: getEntries(), isIndexComplete: true });
  });

  renderer.use('/artwork/:id/(index.html)?', (ctx) => {
    const pathname = toPathname(['artwork', ctx.params['id']]);
    const entry = model.getEntry(pathname);
    model.sitemap.add(pathname, entry.modified);

    const initialData: Data = { entries: {}, isIndexComplete: false };
    initialData.entries[pathname] = entry;
    return render(template, pathname, '/artwork/:id', initialData);
  });

  renderer.use('/artwork/:id/data.json', (ctx) => {
    const pathname = toPathname(['artwork', ctx.params['id']]);
    const entry = model.getEntry(pathname);
    const data = {entries: {
      [pathname]: entry
    }};

    return JSON.stringify(data);
  });

  renderer.use('/artwork/:id/:path*', (ctx) => {
    return fs.readFile(`${model.rootDir}/artwork/${ctx.params.id}/${ctx.params.path.join('/')}`);
  });

  renderer.use('/dictionary/(index.html)?', (ctx) => {
    model.sitemap.add('/dictionary');
    return render(template, '/dictionary', '/dictionary');
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
      entry.appendChild(create('link', { rel: 'alternate', href: new URL(e.path, 'https://koyomiji.com/').toString() }));
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

function render(template: string, pathname: string, routeID: string, data: Data = { entries: {}, isIndexComplete: false }) {
  const model = new Model(data);

  const router = createMemoryRouter(createRoutes(model), {
    initialEntries: [pathname],
    initialIndex: 0,
    hydrationData: {
      loaderData: {
        [routeID]: data
      }
    }
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
    .replace('<!--hydration-data-->', JSON.stringify(data))
    .replace('<!--route-id-->', routeID);
}