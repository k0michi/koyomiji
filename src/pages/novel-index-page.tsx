import * as React from 'react';
import { useModel, useObservable } from 'kyoka';
import { Entry, mapEntries } from "../entry.js";
import { Data, Model } from '../model.js';
import { useLoaderData, useLocation } from 'react-router';
import Link from '../components/link.js';
import { toPathname } from '../utils.js';
import Head from '../components/head.js';

export default function NovelIndexPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const data = useLoaderData() as Data;
  const entries = Object.values(data.entries).filter(e => e.path[0] == 'novel');
  const model = useModel<Model>();
  const map = mapEntries(entries);

  return (
    <>
      <Head url={url} title="Novels" description="🚧 工事中" />
      <header>
        <h1>Novels</h1>
        <div className="meta">🚧 工事中</div>
      </header>
      <div id="body">
        {Object.entries(map).map(([k, v]) =>
          <div className="category" key={k}>
            <h2>{k}</h2>
            <ol>
              {v.map(i => <li key={toPathname(i.path)}><Link href={toPathname(i.path)}>{i.title}</Link></li>)}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}