import * as path from 'path';
import { readText, toPathname } from './utils.js';
import glob from 'glob-promise';
import { createEntry, createRenderer, Registry } from './main-renderer.js';

const contentRoot = './contents';
const outRoot = './dist';

const registry: Registry = {
  rootDir: contentRoot,
  entries: {}
};

(async () => {
  const indexTemplate = await readText('dist/index.html');
  const renderer = createRenderer(outRoot, indexTemplate, registry);

  await renderer.render('/index.html');
  await renderer.render('/about/index.html');
  await renderer.render('/project/index.html');

  for (const p of await glob('**/*', { cwd: contentRoot, nodir: true })) {
    if (p.endsWith('index.ktml')) {
      const entryPath = p.split('/').slice(0, -1);
      const content = await readText(path.join(contentRoot, p));
      registry.entries[toPathname(entryPath)] = createEntry(entryPath, content);
      const htmlPath = `/${entryPath.join('/')}/index.html`;
      await renderer.render(htmlPath);
      const jsonPath = `/${entryPath.join('/')}/entry.json`;
      await renderer.render(jsonPath);
    } else {
      await renderer.render('/' + p);
    }
  }

  await renderer.render('/log/index.html');
  await renderer.render('/knowledge/index.html');
  await renderer.render('/entries.json');
})();