import * as fs from 'fs/promises';
import * as path from 'path';
import * as ejs from 'ejs';
import * as htmlparser2 from "htmlparser2";
import * as CSSselect from "css-select";
import render from "dom-serializer";
import * as domutils from "domutils";
import { walk } from './utils';

const contentRoot = './contents';
const outRoot = './dist';
let indexTemplate;

// const kKoyomoji = '曆路';
const kKoyomoji = 'atelier暦路';

async function readText(path) {
  return await fs.readFile(path, { encoding: 'utf-8' });
}

async function outText(rPath, text) {
  const joinedPath = path.join(outRoot, rPath);
  await fs.mkdir(path.dirname(joinedPath), { recursive: true });
  await fs.writeFile(joinedPath, text);
}

function buildHTML(dom) {
  const $title = CSSselect.selectOne('title', dom);
  let title;

  if ($title != null) {
    title = domutils.textContent($title);
  }

  if (title == null) {
    title = kKoyomoji;
  } else {
    title = `${title} | ${kKoyomoji}`;
  }

  const $body = CSSselect.selectOne('body', dom);
  const body = render($body, { encodeEntities: 'utf8' });
  return ejs.render(indexTemplate, { main: body, title });
}

(async () => {
  indexTemplate = await readText('index.ejs');

  for await (const e of walk(contentRoot)) {
    if (e.endsWith('.html')) {
      const content = await readText(e);
      const dom = htmlparser2.parseDocument(content);
      const html = buildHTML(dom);
      const rPath = path.relative(contentRoot, e);
      await outText(rPath, html);
      console.log(rPath)
    }
  }

  await fs.cp('assets', path.join(outRoot, 'assets'), { recursive: true });
})();