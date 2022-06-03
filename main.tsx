import * as fs from 'fs/promises';
import * as path from 'path';
import { match } from "path-to-regexp";
import { JSDOM } from "jsdom";
import * as Nano from "nano-jsx";
import { walk } from './utils.js';
import BlogPage from './components/blog-page.js';
import KnowledgePage from './components/knowledge-page.js';
import IndexPage from './components/index-page.js';
import BlogIndexPage from './components/blog-index-page.js';
import KnowledgeIndexPage from './components/knowledge-index-page.js';
import { BlogItem, KnowledgeItem } from './post.js';

const contentRoot = './contents';
const outRoot = './dist';
let indexTemplate: string;

const blogMatch = match("blog/:id/index.html", { decode: decodeURIComponent });
const knowledgeMatch = match("knowledge/:category/:id/index.html", { decode: decodeURIComponent });

const jsdom = new JSDOM();

async function readText(path: string) {
  return await fs.readFile(path, { encoding: 'utf-8' });
}

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

(async () => {
  indexTemplate = await readText('dist/index.html');
  const blogItems: BlogItem[] = [];
  const knowledgeItems: KnowledgeItem[] = [];

  for await (const e of walk(contentRoot)) {
    if (e.endsWith('.html')) {
      const content = await readText(e);
      const rPath = path.relative(contentRoot, e);
      const blogResult = blogMatch(rPath);
      const knowledgeResult = knowledgeMatch(rPath);

      if (blogResult) {
        const id = (blogResult.params as any)['id'];

        // Workaround for 'document is not defined'
        await outText(rPath, render(() => {
          const { title, created, body } = parseDocument(content);
          blogItems.push({ id, title, created });

          return (
            <BlogPage title={title} created={new Date(created)} id={id}>
              {body}
            </BlogPage>
          );
        }));

      } else if (knowledgeResult) {
        const id = (knowledgeResult.params as any)['id'];
        const category = (knowledgeResult.params as any)['category'];

        await outText(rPath, render(() => {
          const { title, created, body } = parseDocument(content);
          knowledgeItems.push({ id, category, title, created });

          return (
            <KnowledgePage title={title} created={new Date(created)} id={id} category={category}>
              {body}
            </KnowledgePage>
          );
        }));

      }
    }
  }

  await outText('index.html', render(<IndexPage />));
  await outText('blog/index.html', render(<BlogIndexPage items={blogItems} />));
  await outText('knowledge/index.html', render(<KnowledgeIndexPage items={knowledgeItems} />));
})();

function parseDocument(content: string) {
  const parser = new jsdom.window.DOMParser();
  const $document = parser.parseFromString(content, 'text/xml');

  if (($document.firstChild as Element).tagName == 'parsererror') {
    throw new Error('Failed to parse');
  }

  const $head = $document.querySelector('head');
  const title = getTextContent('title', $head);
  const created = getTextContent('created', $head);

  const $body = $document.querySelector('body')!;
  const body = toElement($body.childNodes);
  return { title, created, body };
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
        if (element.attributes[i].name == 'class') {
          props['className'] = element.attributes[i].value;
        } else {
          props[element.attributes[i].name] = element.attributes[i].value;
        }
      }

      let tag = element.tagName.toLowerCase();

      if (tag == 'math') {
        tag = 'div';
        props.class = 'math-block';
      }

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