import * as React from 'react';
import { Entry, mapEntries } from "../entry.js";
import { Data, Model } from '../model.js';
import Link from '../components/link.js';
import { toPathname } from '../utils.js';
import Head from '../components/head.js';
import { useBufferedData } from '../hooks.js';
import { getCategory } from '../config.js';

export default function KnowledgeIndexPage() {
  const data = useBufferedData<Data>();
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/knowledge/'));
  const map = mapEntries(entries);

  return (
    <>
      <Head title="Knowledge" description="学んだことの覚書。" />
      <header>
        <h1>Knowledge</h1>
        <div className="meta">学んだことの覚書。</div>
      </header>
      <div id="body">
        {Object.entries(map).map(([k, v]) =>
          <div className="category" key={k}>
            <h2>{getCategory(k)?.name}</h2>
            <ul>
              {v.map(i => <li key={i.path}><Link href={i.path}>{i.title}</Link></li>)}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}