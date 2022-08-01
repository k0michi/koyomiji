import * as path from 'path';
import { walk, readText } from './utils.js';
import glob from 'glob-promise';
import { createPost, createRenderer, Registry } from './main-renderer.js';

const contentRoot = './contents';
const outRoot = './dist';

const registry: Registry = {
  rootDir: contentRoot,
  logItems: {},
  knowledgeItems: {}
};

(async () => {
  const indexTemplate = await readText('dist/index.html');
  const renderer = createRenderer(outRoot, indexTemplate, registry);

  await renderer.render('/index.html');
  await renderer.render('/about/index.html');

  for (const p of await glob('log/*/*', { cwd: contentRoot })) {
    if (p.endsWith('index.ktml')) {
      const id = p.split('/')[1];
      const content = await readText(path.join(contentRoot, p));
      registry.logItems[[id].join('/')] = createPost(content, id, ['log', id]);
      const htmlPath = `/log/${id}/index.html`;
      await renderer.render(htmlPath);
    } else {
      await renderer.render(p);
    }
  }

  for (const p of await glob('knowledge/*/*/*', { cwd: contentRoot })) {
    if (p.endsWith('index.ktml')) {
      const category = p.split('/')[1];
      const id = p.split('/')[2];
      const content = await readText(path.join(contentRoot, p));
      registry.knowledgeItems[[category, id].join('/')] = createPost(content, id, ['knowledge', category, id], category);
      const htmlPath = `/knowledge/${category}/${id}/index.html`;
      await renderer.render(htmlPath);
    } else {
      await renderer.render(p);
    }
  }

  await renderer.render('/log/index.html');
  await renderer.render('/knowledge/index.html');
})();