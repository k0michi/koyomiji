import * as React from 'react';
import { Entry, mapEntries } from "../entry.js";
import { Data, Model } from '../model.js';
import Link from '../components/link.js';
import Head from '../components/head.js';
import { useBufferedData } from '../hooks.js';

export default function NovelIndexPage() {
  const data = useBufferedData<Data>();
  const entries = Object.values(data.entries).filter(e => e.path[0] == 'novel');
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