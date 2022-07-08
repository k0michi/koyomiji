import * as path from 'path';
import * as Nano from "nano-jsx";
import { walk, readText } from './utils.js';
import { Post } from './post.js';
import glob from 'glob-promise';
import { Renderer } from './renderer.js';
import * as ktml from './ktml.js';
import { Root } from './components/root.js';

interface Registry {
  logItems: { [key: string]: Post };
  knowledgeItems: { [key: string]: Post };
}

const contentRoot = './contents';
const outRoot = './dist';
let indexTemplate: string;
const registry: Registry = {
  logItems: {},
  knowledgeItems: {}
};

(async () => {
  indexTemplate = await readText('dist/index.html');
  const renderer = createRenderer();

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

function createRenderer() {
  const renderer = new Renderer(outRoot);

  renderer.use('/index.html', (ctx) => {
    return render(<Root />, '/');
  });

  renderer.use('/about/index.html', (ctx) => {
    return render(<Root />, '/about');
  });

  renderer.use('/log/:id/index.html', async (ctx) => {
    const params = ctx.params as any;
    const id = params['id'] as string;
    const post = registry.logItems[[id].join('/')];

    return render(() => {
      const { title, created, description } = post.head;
      const body = ktml.toElement(post.body.childNodes);

      return (
        <Root title={title} created={new Date(created)} id={id} description={description}>
          {body}
        </Root>
      );
    }, `/log/${id}`)
  });

  renderer.use('/knowledge/:category/:id/index.html', async (ctx) => {
    const params = ctx.params as any;
    const id = params['id'] as string;
    const category = params['category'] as string;
    const post = registry.knowledgeItems[[category, id].join('/')];

    return render(() => {
      const { title, created, description } = post.head;
      const body = ktml.toElement(post.body.childNodes);

      return (
        <Root title={title} created={new Date(created)} id={id} category={category} description={description}>
          {body}
        </Root>
      );
    }, `/knowledge/${category}/${id}`);
  });

  renderer.use('/log/index.html', (ctx) => {
    return render(<Root items={Object.values(registry.logItems).map(p => p.head)} />, '/log');
  });

  renderer.use('/knowledge/index.html', (ctx) => {
    return render(<Root items={Object.values(registry.knowledgeItems).map(p => p.head)} />, '/knowledge');
  });

  return renderer;
}

function render(children: any, pathname: string) {
  const app = Nano.renderSSR(children, { pathname });
  const { body, head, footer } = Nano.Helmet.SSR(app);
  return indexTemplate
    .replace('<!--head-->', head.join('\n'))
    .replace('<!--body-->', body)
    .replace('<!--footer-->', footer.join('\n'));
}

function createPost(content: string, id: string, category?: string): Post {
  const $document = ktml.parseXML(content);
  const $head = $document.querySelector('head');
  const title = ktml.getTextContent('title', $head);
  const created = ktml.getTextContent('created', $head);

  const $body = $document.querySelector('body')!;
  ktml.transformMath($body);
  ktml.transformCode($body);
  const description = ktml.getDescription($body, 120);
  const head = { title, created, description, id, category };
  return { head, body: $body };
}