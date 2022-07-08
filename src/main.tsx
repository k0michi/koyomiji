import * as path from 'path';
import { walk, readText } from './utils.js';
import glob from 'glob-promise';
import { createPost, createRenderer, Registry } from './main-renderer.js';

const contentRoot = './contents';
const outRoot = './dist';

const registry: Registry = {
  logItems: {},
  knowledgeItems: {}
};

(async () => {
  const indexTemplate = await readText('dist/index.html');
  const renderer = createRenderer(outRoot, indexTemplate, registry);

  await renderer.render('/index.html');
  await renderer.render('/about/index.html');

  for (const p of await glob('log/*/index.ktml', { cwd: contentRoot })) {
    const id = p.split('/')[1];
    const content = await readText(path.join(contentRoot, p));
    registry.logItems[[id].join('/')] = createPost(content, id);
    const htmlPath = `/log/${id}/index.html`;
    await renderer.render(htmlPath);
  }

  for (const p of await glob('knowledge/*/*/index.ktml', { cwd: contentRoot })) {
    const category = p.split('/')[1];
    const id = p.split('/')[2];
    const content = await readText(path.join(contentRoot, p));
    registry.knowledgeItems[[category, id].join('/')] = createPost(content, id, category);
    const htmlPath = `/knowledge/${category}/${id}/index.html`;
    await renderer.render(htmlPath);
  }

  await renderer.render('/log/index.html');
  await renderer.render('/knowledge/index.html');
})();