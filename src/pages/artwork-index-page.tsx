import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useModel, useObservable } from 'kyoka';
import dateToString from '../date-format.js';
import { Entry } from "../entry.js";
import { Model } from '../model.js';
import { useLocation } from 'react-router';
import Link from '../components/link.js';
import Icon from '../components/icon.js';
import { toPathname } from '../utils.js';

function getID(p: Entry) {
  return p.path[1];
}

export default function ArtworkIndexPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const model = useModel<Model>();
  const entries = Object.values(useObservable(model.entries)).filter(e => e.path[0] == 'artwork');
  entries.sort((a, b) => getID(b).localeCompare(getID(a), undefined, { numeric: true }));
  model.checkIfIndexComplete();

  return (
    <>
      <Helmet>
        <title>Artworks | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="Artworks" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Helmet>
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