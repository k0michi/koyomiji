import * as Nano from "nano-jsx";
import { Root } from "./components/root.js";
import { Post } from "./post.js";
import { Renderer } from "./renderer.js";
import * as ktml from './ktml.js';

export interface Registry {
  logItems: { [key: string]: Post };
  knowledgeItems: { [key: string]: Post };
}

export function createRenderer(outRoot: string, template: string, registry:Registry) {
  const renderer = new Renderer(outRoot);

  renderer.use('/index.html', (ctx) => {
    return render(<Root />, template, '/');
  });

  renderer.use('/about/index.html', (ctx) => {
    return render(<Root />, template, '/about');
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
    }, template, `/log/${id}`)
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
    }, template, `/knowledge/${category}/${id}`);
  });

  renderer.use('/log/index.html', (ctx) => {
    return render(<Root items={Object.values(registry.logItems).map(p => p.head)} />, template, '/log');
  });

  renderer.use('/knowledge/index.html', (ctx) => {
    return render(<Root items={Object.values(registry.knowledgeItems).map(p => p.head)} />, template, '/knowledge');
  });

  return renderer;
}

export function render(children: any, template: string, pathname: string) {
  const app = Nano.renderSSR(children, { pathname });
  const { body, head, footer } = Nano.Helmet.SSR(app);
  return template
    .replace('<!--head-->', head.join('\n'))
    .replace('<!--body-->', body)
    .replace('<!--footer-->', footer.join('\n'));
}

export function createPost(content: string, id: string, category?: string): Post {
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