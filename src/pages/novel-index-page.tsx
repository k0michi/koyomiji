import * as React from 'react';
import { ArticleDocument, mapEntries } from "../document.js";
import { Data, Model } from '../model.js';
import Link from '../components/link.js';
import Head from '../components/head.js';
import { useLoaderData } from 'react-router';

export default function NovelIndexPage() {
  const data = useLoaderData() as Data;
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/novel'));
  const map = mapEntries(entries);

  return (
    <>
      <Head title="Novels" description="🚧 工事中" />
      <header>
        <h1>Novels</h1>
        <div className="meta">🚧 工事中</div>
      </header>
      <div id="body">
        {Object.entries(map).map(([k, v]) =>
          <div className="category" key={k}>
            <h2>{k}</h2>
            <ol>
              {v.map(i => <li key={i.path}><Link href={i.path}>{i.title}</Link></li>)}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}