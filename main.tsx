import * as fs from 'fs/promises';
import * as path from 'path';
import { match } from "path-to-regexp";
import { JSDOM } from "jsdom";
import * as Nano from "nano-jsx";
import { walk, readText } from './utils.js';
import BlogPage from './components/blog-page.js';
import KnowledgePage from './components/knowledge-page.js';
import IndexPage from './components/index-page.js';
import BlogIndexPage from './components/blog-index-page.js';
import KnowledgeIndexPage from './components/knowledge-index-page.js';
import { BlogItem, KnowledgeItem } from './post.js';

const contentRoot = './contents';
const outRoot = './dist';
let indexTemplate: string;

const blogMatch = match("blog/:id/index.ktml", { decode: decodeURIComponent });
const knowledgeMatch = match("knowledge/:category/:id/index.ktml", { decode: decodeURIComponent });

const jsdom = new JSDOM();

async function outText(rPath: string, text: string) {
  const joinedPath = path.join(outRoot, rPath);
  await fs.mkdir(path.dirname(joinedPath), { recursive: true });
  await fs.writeFile(joinedPath, text);
  console.log(`Built: ${rPath}`);
}

function render(children: any) {
  const app = Nano.renderSSR(children);
  const { body, head, footer } = Nano.Helmet.SSR(app);
  return indexTemplate
    .replace('<!--head-->', head.join('\n'))
    .replace('<!--body-->', body)
    .replace('<!--footer-->', footer.join('\n'));
}

function replaceExt(rPath: string) {
  return rPath.substring(0, rPath.indexOf('.') + 1) + 'html';
}

(async () => {
  indexTemplate = await readText('dist/index.html');
  const blogItems: BlogItem[] = [];
  const knowledgeItems: KnowledgeItem[] = [];

  for await (const e of walk(contentRoot)) {
    const content = await readText(e);
    const rPath = path.relative(contentRoot, e);
    const blogResult = blogMatch(rPath);
    const knowledgeResult = knowledgeMatch(rPath);

    if (blogResult) {
      const id = (blogResult.params as any)['id'];

      // Workaround for 'document is not defined'
      await outText(replaceExt(rPath), render(() => {
        const { title, created, body, description } = parseDocument(content);
        blogItems.push({ id, title, created, description });

        return (
          <BlogPage title={title} created={new Date(created)} id={id} description={description}>
            {body}
          </BlogPage>
        );
      }));

    } else if (knowledgeResult) {
      const id = (knowledgeResult.params as any)['id'];
      const category = (knowledgeResult.params as any)['category'];

      await outText(replaceExt(rPath), render(() => {
        const { title, created, body, description } = parseDocument(content);
        knowledgeItems.push({ id, category, title, created, description });

        return (
          <KnowledgePage title={title} created={new Date(created)} id={id} category={category} description={description}>
            {body}
          </KnowledgePage>
        );
      }));
    }
  }

  await outText('index.html', render(<IndexPage />));
  await outText('blog/index.html', render(<BlogIndexPage items={blogItems} />));
  await outText('knowledge/index.html', render(<KnowledgeIndexPage items={knowledgeItems} />));
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
    const mathDiv = document.createElement('div');
    mathDiv.className = 'math-block';
    mathDiv.textContent = math.textContent;
    math.parentNode?.replaceChild(mathDiv, math);
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