import * as fs from 'fs/promises';
import * as path from 'path';
import { Match, match, MatchResult } from "path-to-regexp";
import { JSDOM } from "jsdom";
import * as Nano from "nano-jsx";
import { walk, readText } from './utils.js';
import LogPage from './components/log-page.js';
import KnowledgePage from './components/knowledge-page.js';
import IndexPage from './components/index-page.js';
import LogIndexPage from './components/log-index-page.js';
import KnowledgeIndexPage from './components/knowledge-index-page.js';
import { LogItem, KnowledgeItem } from './post.js';
import AboutPage from './components/about-page.js';
import glob from 'glob-promise';

const contentRoot = './contents';
const outRoot = './dist';
let indexTemplate: string;

const jsdom = new JSDOM();

async function copy(src: string, dest: string) {
  const joinedPath = path.join(outRoot, dest);
  await fs.copyFile(src, joinedPath);
}

function render(children: any) {
  const app = Nano.renderSSR(children);
  const { body, head, footer } = Nano.Helmet.SSR(app);
  return indexTemplate
    .replace('<!--head-->', head.join('\n'))
    .replace('<!--body-->', body)
    .replace('<!--footer-->', footer.join('\n'));
}

interface Context {
  params: object;
}

type Middleware = (ctx: Context) => string | Promise<string>;

interface Route {
  path:string;
  middleware: Middleware;
}

class Renderer {
  rootDir: string;
  routes: Route[];

  constructor(rootDir: string) {
    this.rootDir = rootDir;
    this.routes = [];
  }

  use(path: string, middleware: Middleware) {
    const route = {path, middleware};
    this.routes.push(route);
  }

  async render(pPath: string) {
    for (const route of this.routes) {
      const matchFunc = match(route.path);
      const result = matchFunc(pPath);
      const context: Context = {params:(result as MatchResult).params};

      if (result) {
        let content = route.middleware(context);

        if (content instanceof Promise) {
          content = await content;
        }

        await fs.mkdir(path.dirname(path.join(this.rootDir, pPath)), {recursive:true});
        await fs.writeFile(path.join(this.rootDir, pPath), content);
        console.log(path.join(this.rootDir, pPath))
        break;
      }
    }
  }
}

(async () => {
  indexTemplate = await readText('dist/index.html');
  const logItems: LogItem[] = [];
  const knowledgeItems: KnowledgeItem[] = [];
  const renderer = new Renderer(outRoot);

  renderer.use('/index.html', (ctx)=>{
    return render(<IndexPage />);
  });

  await renderer.render('/index.html');

  renderer.use('/about/index.html', (ctx)=>{
    return  render(<AboutPage />);
  });

  await renderer.render('/about/index.html');

  renderer.use('/log/:id/index.html',  async (ctx)=>{
    const id = (ctx.params as any)['id'];
    const content = await readText(path.join(contentRoot, 'log',id,'index.ktml'));

    // Workaround for 'document is not defined'
    return render(() => {
      const { title, created, body, description } = parseDocument(content);
      logItems.push({ id, title, created, description });

      return (
        <LogPage title={title} created={new Date(created)} id={id} description={description}>
          {body}
        </LogPage>
      );
    })
  });

  for (const p of await glob('log/*/index.ktml', {cwd:contentRoot})) {
    const htmlPath = `/${path.dirname(p)}/index.html`;
    await renderer.render(htmlPath);
  }

  renderer.use('/knowledge/:category/:id/index.html',  async (ctx)=>{
    const id = (ctx.params as any)['id'];
    const category = (ctx.params as any)['category'];
    const content = await readText(path.join(contentRoot, 'knowledge',category,id,'index.ktml'));

    return render(() => {
      const { title, created, body, description } = parseDocument(content);
      knowledgeItems.push({ id, category, title, created, description });

      return (
        <KnowledgePage title={title} created={new Date(created)} id={id} category={category} description={description}>
          {body}
        </KnowledgePage>
      );
    });
  });

  for (const p of await glob('knowledge/*/*/index.ktml', {cwd:contentRoot})) {
    const htmlPath = `/${path.dirname(p)}/index.html`;
    await renderer.render(htmlPath);
  }

  renderer.use('/log/index.html', (ctx)=>{
    return render(<LogIndexPage items={logItems} />);
  });

  await renderer.render('/log/index.html');

  renderer.use('/knowledge/index.html', (ctx)=>{
    return render(<KnowledgeIndexPage items={knowledgeItems} />);
  });

  await renderer.render('/knowledge/index.html');
  await copy('src/assets/favicon.ico', 'favicon.ico');
})();

function parseDocument(content: string) {
  const $document = parseXML(content);
  const $head = $document.querySelector('head');
  const title = getTextContent('title', $head);
  const created = getTextContent('created', $head);

  const $body = $document.querySelector('body')!;
  transformMath($body);
  transformCode($body);
  const body = toElement($body.childNodes);
  const description = getDescription($body, 120);
  return { title, created, body, description };
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