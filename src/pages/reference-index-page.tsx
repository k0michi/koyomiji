import * as React from 'react';
import { Entry, mapEntries } from "../../lib/entry.js";
import { Data, Model } from '../model.js';
import Link from '../components/link.js';
import { toPathname } from '../utils.js';
import Head from '../components/head.js';
import { getCategory } from '../../lib/config.js';
import { useLoaderData } from 'react-router';

export default function ReferenceIndexPage() {
  const data = useLoaderData() as Data;
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/reference/'));
  const map = mapEntries(entries);

  return (
    <>
      <Head title="Reference" description="学んだことの覚書。" />
      <header>
        <h1>Reference</h1>
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