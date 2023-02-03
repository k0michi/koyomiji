import * as React from 'react';
import { useModel, useObservable } from 'kyoka';
import { Document } from "../document.js";
import { Data, Model } from '../model.js';
import { useLoaderData, useLocation } from 'react-router';
import Link from '../components/link.js';
import { toPathname } from '../utils.js';
import Head from '../components/head.js';

function getID(p: Document) {
  return p.path[1];
}

export default function ArtworkIndexPage() {
  const data = useLoaderData() as Data;
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/artwork'));
  entries.sort((a, b) => getID(b).localeCompare(getID(a), undefined, { numeric: true }));
  const model = useModel<Model>();

  return (
    <>
      <Head title="Artworks" description="描いたイラスト。" />
      <header>
        <h1>Artworks</h1>
        <div className="meta">描いたイラスト。</div>
      </header>
      <div id="body">
        <div className="thumbnail-list">
          {entries.map(i =>
            <div className="thumbnail" key={i.path}>
              <Link href={i.path}>
                <img src={i.source!} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}