import * as React from 'react';
import { useModel, useObservable } from 'kyoka';
import { Entry } from "../entry.js";
import { Data, Model } from '../model.js';
import { useLoaderData, useLocation } from 'react-router';
import Link from '../components/link.js';
import { toPathname } from '../utils.js';
import Head from '../components/head.js';

function getID(p: Entry) {
  return p.path[1];
}

export default function ArtworkIndexPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const data = useLoaderData() as Data;
  const entries = Object.values(data.entries).filter(e => e.path[0] == 'artwork');
  entries.sort((a, b) => getID(b).localeCompare(getID(a), undefined, { numeric: true }));
  const model = useModel<Model>();

  return (
    <>
      <Head url={url} title="Artworks" description="🚧 工事中" />
      <header>
        <h1>Artworks</h1>
        <div className="meta">🚧 工事中</div>
      </header>
      <div id="body">
        <div className="thumbnail-list">
          {entries.map(i =>
            <div className="thumbnail" key={toPathname(i.path)}>
              <Link href={`/artwork/${getID(i)}`}>
                <img src={i.source!} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}