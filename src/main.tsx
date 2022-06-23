import * as path from 'path';
import { JSDOM } from "jsdom";
import * as Nano from "nano-jsx";
import { walk, readText } from './utils.js';
import LogPage from './components/log-page.js';
import KnowledgePage from './components/knowledge-page.js';
import IndexPage from './components/index-page.js';
import LogIndexPage from './components/log-index-page.js';
import KnowledgeIndexPage from './components/knowledge-index-page.js';
import { Post } from './post.js';
import AboutPage from './components/about-page.js';
import glob from 'glob-promise';
import { Renderer } from './renderer.js';

interface Registry {
  logItems: { [key: string]: Post };
  knowledgeItems: { [key: string]: Post };
}

const contentRoot = './contents';
const outRoot = './dist';
let indexTemplate: string;
const jsdom = new JSDOM();
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
    return render(<IndexPage />);
  });

  renderer.use('/about/index.html', (ctx) => {
    return render(<AboutPage />);
  });

  renderer.use('/log/:id/index.html', async (ctx) => {
    const params = ctx.params as any;
    const id = params['id'] as string;
    const post = registry.logItems[[id].join('/')];

    return render(() => {
      const { title, created, description } = post.head;
      const body = toElement(post.body.childNodes);

      return (
        <LogPage title={title} created={new Date(created)} id={id} description={description}>
          {body}
        </LogPage>
      );
    })
  });

  renderer.use('/knowledge/:category/:id/index.html', async (ctx) => {
    const params = ctx.params as any;
    const id = params['id'] as string;
    const category = params['category'] as string;
    const post = registry.knowledgeItems[[category, id].join('/')];

    return render(() => {
      const { title, created, description } = post.head;
      const body = toElement(post.body.childNodes);

      return (
        <KnowledgePage title={title} created={new Date(created)} id={id} category={category} description={description}>
          {body}
        </KnowledgePage>
      );
    });
  });

  renderer.use('/log/index.html', (ctx) => {
    return render(<LogIndexPage items={Object.values(registry.logItems).map(p => p.head)} />);
  });

  renderer.use('/knowledge/index.html', (ctx) => {
    return render(<KnowledgeIndexPage items={Object.values(registry.knowledgeItems).map(p => p.head)} />);
  });

  return renderer;
}

function render(children: any) {
  const app = Nano.renderSSR(children);
  const { body, head, footer } = Nano.Helmet.SSR(app);
  return indexTemplate
    .replace('<!--head-->', head.join('\n'))
    .replace('<!--body-->', body)
    .replace('<!--footer-->', footer.join('\n'));
}

function createPost(content: string, id: string, category?: string): Post {
  const $document = parseXML(content);
  const $head = $document.querySelector('head');
  const title = getTextContent('title', $head);
  const created = getTextContent('created', $head);

  const $body = $document.querySelector('body')!;
  transformMath($body);
  transformCode($body);
  const description = getDescription($body, 120);
  const head = { title, created, description, id, category };
  return { head, body: $body };
}

function parseXML(string: string) {
  const parser = new jsdom.window.DOMParser();
  const $document = parser.parseFromString(string, 'text/xml');

  if (($document.firstChild as Element).tagName == 'parsererror') {
    throw new Error('Failed to parse');
  }

  return $document;
}

function getDescription(node: Node, limit: number) {
  const Node = jsdom.window.Node;

  if (node.nodeType == Node.TEXT_NODE) {
    const text = node as Text;
    return text.data;
  } else {
    let desc = '';

    for (const childNode of node.childNodes) {
      desc += getDescription(childNode, limit).trimStart();

      if (desc.length > limit) {
        desc = desc.substring(0, limit) + '…';
        break;
      }
    }

    return desc;
  }
}

function transformMath(element: Element) {
  const document = element.ownerDocument!;

  for (const math of element.querySelectorAll('math')) {
    const parentTag = (math.parentNode as Element).tagName;

    if (isContainerBlock(parentTag)) {
      const mathDiv = document.createElement('div');
      mathDiv.className = 'math-block';
      mathDiv.textContent = math.textContent;
      math.parentNode?.replaceChild(mathDiv, math);
    } else {
      const mathSpan = document.createElement('span');
      mathSpan.className = 'math-inline';
      mathSpan.textContent = math.textContent;
      math.parentNode?.replaceChild(mathSpan, math);
    }
  }
}

function transformCode(element: Element) {
  const document = element.ownerDocument!;

  for (const code of element.querySelectorAll('code')) {
    const parentTag = (code.parentNode as Element).tagName;
    const lang = code.getAttribute('lang') ?? '';
    code.removeAttribute('lang');

    if (lang != null) {
      code.className = `language-${lang}`;
    }

    if (isContainerBlock(parentTag)) {
      const pre = document.createElement('pre');

      if (lang != null) {
        pre.className = `language-${lang}`;
      }

      code.parentNode?.replaceChild(pre, code);
      pre.appendChild(code);
    }
  }
}

function isContainerBlock(tagName: string) {
  return tagName == 'body';
}

function toElement(node: Node | NodeList): any {
  const Node = jsdom.window.Node;
  const NodeList = jsdom.window.NodeList;

  if (node instanceof NodeList) {
    const children = [];
    children.length = node.length;

    for (let i = 0; i < node.length; i++) {
      children[i] = toElement(node[i]);
    }

    return Nano.h(Nano.Fragment, {}, ...children);
  } else {
    if (node.nodeType == Node.DOCUMENT_NODE) {
      return toElement(node.childNodes);
    } else if (node.nodeType == Node.ELEMENT_NODE) {
      const element = node as Element;
      const children = [];
      children.length = node.childNodes.length;

      for (let i = 0; i < node.childNodes.length; i++) {
        children[i] = toElement(node.childNodes[i]);
      }

      const props: any = {};

      for (let i = 0; i < element.attributes.length; i++) {
        props[element.attributes[i].name] = element.attributes[i].value;
      }

      const tag = element.tagName.toLowerCase();

      return Nano.h(tag, props, ...children);
    } else if (node.nodeType == Node.TEXT_NODE) {
      const text = node as Text;
      return text.data;
    }
  }
}

function getTextContent(query: string, $element: any) {
  if ($element == null) {
    return null;
  }

  const $found = $element.querySelector(query, $element);

  if ($found == null) {
    return null;
  }

  return $found.textContent;
}