import * as path from 'path';
import { walk, readText } from './utils.js';
import glob from 'glob-promise';
import { createPost, createRenderer, Registry } from './main-renderer.js';

const contentRoot = './contents';
const outRoot = './dist';

const registry: Registry = {
  rootDir: contentRoot,
  posts: {}
};

(async () => {
  const indexTemplate = await readText('dist/index.html');
  const renderer = createRenderer(outRoot, indexTemplate, registry);

  await renderer.render('/index.html');
  await renderer.render('/about/index.html');
  await renderer.render('/project/index.html');

  for (const p of await glob('**/*', { cwd: contentRoot, nodir: true })) {
    if (p.endsWith('index.ktml')) {
      const postPath = p.split('/').slice(0, -1);
      const content = await readText(path.join(contentRoot, p));
      registry.posts[p] = createPost(postPath, content);
      const htmlPath = `/${postPath.join('/')}/index.html`;
      await renderer.render(htmlPath);
    } else {
      await renderer.render('/' + p);
    }
  }

  await renderer.render('/log/index.html');
  await renderer.render('/knowledge/index.html');
})();