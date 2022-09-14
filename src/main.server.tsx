import { readFileUTF8, toPathname } from './utils.js';
import glob from 'glob-promise';
import { createRenderer } from './renderer.js';
import { ServerModel } from './server-model.js';

const contentRoot = './contents';
const outRoot = './dist';

const model = new ServerModel(contentRoot);

(async () => {
  const indexTemplate = await readFileUTF8('dist/index.html');
  const renderer = createRenderer(outRoot, indexTemplate, model);

  await renderer.render('/index.html');
  await renderer.render('/about/index.html');
  await renderer.render('/project/index.html');

  for (const p of await glob('**/*', { cwd: contentRoot, nodir: true })) {
    if (p.endsWith('index.ktml')) {
      const entryPath = p.split('/').slice(0, -1);
      await model.loadEntry(p);
      const htmlPath = `/${entryPath.join('/')}/index.html`;
      await renderer.render(htmlPath);
      const jsonPath = `/${entryPath.join('/')}/entry.json`;
      await renderer.render(jsonPath);
    } else if (p.endsWith('index.kdml')) {
      await model.loadDictionary(p);
    } else {
      await renderer.render('/' + p);
    }
  }

  await renderer.render('/log/index.html');
  await renderer.render('/knowledge/index.html');
  await renderer.render('/novel/index.html');
  await renderer.render('/artwork/index.html');
  await renderer.render('/dictionary/index.html');
  await renderer.render('/dictionary/data.json');
  await renderer.render('/entries.json');
  await renderer.render('/feed.xml');
})();