import * as React from 'react';
import { categoryNames } from "../category.js";
import { Entry, mapEntries } from "../entry.js";
import { useModel, useObservable } from 'kyoka';
import { Model } from '../model.js';
import { useLocation } from 'react-router';
import Link from '../components/link.js';
import { toPathname } from '../utils.js';
import Head from '../components/head.js';

export default function KnowledgeIndexPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const model = useModel<Model>();
  const entries = Object.values(useObservable(model.entries)).filter(e => e.path[0] == 'knowledge');
  model.checkIfIndexComplete();
  const map = mapEntries(entries);

  return (
    <>
      <Head url={url} title="Knowledge" description="学んだことの覚書。" />
      <header>
        <h1>Knowledge</h1>
        <div className="meta">学んだことの覚書。</div>
      </header>
      <div id="body">
        {Object.entries(map).map(([k, v]) =>
          <div className="category" key={k}>
            <h2>{categoryNames[k]}</h2>
            <ul>
              {v.map(i => <li key={toPathname(i.path)}><Link href={toPathname(i.path)}>{i.title}</Link></li>)}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}