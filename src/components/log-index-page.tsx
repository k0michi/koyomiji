import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useModel, useObservable } from 'kyoka';
import dateToString from '../date-format.js';
import { Entry } from "../entry.js";
import { Model } from '../model.js';
import { useLocation } from 'react-router';
import Link from './link.js';

function getID(p: Entry) {
  return p.path[1];
}

export default function LogIndexPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const model = useModel<Model>();
  const entries = Object.values(useObservable(model.entries)).filter(e => e.path[0] == 'log');
  entries.sort((a, b) => getID(b).localeCompare(getID(a), undefined, { numeric: true }));
  const assets = useObservable(model.assets);

  return (
    <>
      <Helmet>
        <title>Logs | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="Logs" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Helmet>
      <h1>Logs</h1>
      {entries.map(i =>
        <div className="summary" key={getID(i)}>
          <h2><Link href={`/log/${getID(i)}`}>{i.title}</Link></h2>
          <div className="meta">
            <div className="number">#{getID(i)}</div>
            <div className="date"><div className="calender-icon" dangerouslySetInnerHTML={{ __html: assets['calenderIcon'] }} /><div>{dateToString(new Date(i.created))}</div></div>
          </div>
          <p>{i.description}</p>
          <hr />
        </div>
      )}
    </>
  );
}