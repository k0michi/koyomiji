import * as React from 'react';
import { Helmet } from 'react-helmet';
import { categoryNames } from "../category.js";
import { Entry } from "../entry.js";
import { useModel, useObservable } from 'kyoka';
import { Model } from '../model.js';
import { useLocation } from 'react-router';
import Link from './link.js';

function getCategory(p: Entry) {
  return p.path[1];
}

function getID(p: Entry) {
  return p.path[2];
}

export default function KnowledgeIndexPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const model = useModel<Model>();
  const entries = useObservable(model.entries).slice().filter(e=>e.path[0] == 'knowledge');

  entries.sort((a, b) => {
    if (getCategory(a) == getCategory(b)) {
      return getID(a).localeCompare(getID(b));
    } else {
      return getCategory(a).localeCompare(getCategory(b));
    }
  });

  const map: { [key: string]: Entry[]; } = {};

  for (const item of entries) {
    if (map[getCategory(item)] == null) {
      map[getCategory(item)] = [];
    }

    map[getCategory(item)].push(item);
  }

  return (
    <>
      <Helmet>
        <title>Knowledge | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="Knowledge" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Helmet>
      <h1>Knowledge</h1>
      {Object.entries(map).map(([k, v]) =>
        <div className="category" key={k}>
          <h2>{categoryNames[k]}</h2>
          <ul>
            {v.map(i => <li key={`${getCategory(i)}/${getID(i)}`}><Link href={`/knowledge/${getCategory(i)}/${getID(i)}`}>{i.title}</Link></li>)}
          </ul>
        </div>
      )}
    </>
  );
}