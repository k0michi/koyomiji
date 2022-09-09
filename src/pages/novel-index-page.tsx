import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useModel, useObservable } from 'kyoka';
import dateToString from '../date-format.js';
import { Entry, mapEntries } from "../entry.js";
import { Model } from '../model.js';
import { useLocation } from 'react-router';
import Link from '../components/link.js';
import Icon from '../components/icon.js';
import { toPathname } from '../utils.js';

export default function NovelIndexPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const model = useModel<Model>();
  const entries = Object.values(useObservable(model.entries)).filter(e => e.path[0] == 'novel');
  model.checkIfIndexComplete();
  const map = mapEntries(entries);

  return (
    <>
      <Helmet>
        <title>Novels | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="Novels" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Helmet>
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