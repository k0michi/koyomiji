import * as fs from 'fs/promises';
import * as path from 'path';
import * as ejs from 'ejs';
import * as htmlparser2 from "htmlparser2";
import * as CSSselect from "css-select";
import render from "dom-serializer";
import * as domutils from "domutils";
import { match } from "path-to-regexp";
import { walk } from './utils';

const contentRoot = './contents';
const outRoot = './dist';
let indexTemplate;

const kKoyomoji = '曆路堂';

async function readText(path) {
  return await fs.readFile(path, { encoding: 'utf-8' });
}

async function outText(rPath, text) {
  const joinedPath = path.join(outRoot, rPath);
  await fs.mkdir(path.dirname(joinedPath), { recursive: true });
  await fs.writeFile(joinedPath, text);
}

function buildHTML(title, main) {
  return ejs.render(indexTemplate, { main, title });
}

const blogMatch = match("blog/:id/index.html", { decode: decodeURIComponent });
const knowledgeMatch = match("knowledge/:category/:id/index.html", { decode: decodeURIComponent });

(async () => {
  indexTemplate = await readText('index.ejs');

  for await (const e of walk(contentRoot)) {
    if (e.endsWith('.html')) {
      const content = await readText(e);
      const rPath = path.relative(contentRoot, e);
      const blogResult = blogMatch(rPath);
      const knowledgeResult = knowledgeMatch(rPath);
      let html;

      if (blogResult) {
        const id = blogResult.params['id'];
        html = buildBlog(id, content);
      } else if (knowledgeResult) {
        const id = knowledgeResult.params['id'];
        const category = knowledgeResult.params['category'];
        html = buildKnowledge(id, category, content);
      } else {
        html = buildGeneral(content);
      }

      await outText(rPath, html);
      console.log(rPath)
    }
  }

  await fs.cp('assets', path.join(outRoot, 'assets'), { recursive: true });
})();

function getTextContent(query, $element) {
  if ($element == null) {
    return null;
  }

  const $found = CSSselect.selectOne(query, $element);

  if ($found == null) {
    return null;
  }

  return domutils.textContent($found);
}

function buildBlog(id, content) {
  const dom = htmlparser2.parseDocument(content);

  const $head = CSSselect.selectOne('head', dom);
  let title = getTextContent('title', $head);
  const created = getTextContent('created', $head);

  const $body = CSSselect.selectOne('body', dom);
  let main = render($body.childNodes, { encodeEntities: 'utf8' });
  main = ejs.render(`<h1><span class="blog-id">#<%= id %></span> <%= title %> <span class="blog-date"><%= created %></span></h1><%- main %>`, { id, title, created, main });

  const pageTitle = `${title} | ${kKoyomoji}`;
  return buildHTML(pageTitle, main);
}

const categoryNames = {
  'linux': 'Linux'
}

function buildKnowledge(id, category, content) {
  const dom = htmlparser2.parseDocument(content);

  const $head = CSSselect.selectOne('head', dom);
  const categoryName = categoryNames[category];
  let title = getTextContent('title', $head);
  title = `[${categoryName}] ${title}`;
  const created = getTextContent('created', $head);

  const $body = CSSselect.selectOne('body', dom);
  let main = render($body.childNodes, { encodeEntities: 'utf8' });
  main = ejs.render(`<h1><%= title %> <span class="blog-date"><%= created %></span></h1><%- main %>`, { title, created, main });

  const pageTitle = `${title} | ${kKoyomoji}`;
  return buildHTML(pageTitle, main);
}

function buildGeneral(content) {
  const dom = htmlparser2.parseDocument(content);

  const $head = CSSselect.selectOne('head', dom);
  let title = getTextContent('title', $head);

  if (title == null) {
    title = kKoyomoji;
  } else {
    title = `${title} | ${kKoyomoji}`;
  }

  const $body = CSSselect.selectOne('body', dom);
  let main = render($body.childNodes, { encodeEntities: 'utf8' });

  return buildHTML(title, main);
}