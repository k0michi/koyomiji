import * as React from 'react';
import { useModel, useObservable } from 'kyoka';
import dateToString from '../date-format.js';
import { Entry } from "../entry.js";
import { Model } from '../model.js';
import { useLocation } from 'react-router';
import Link from '../components/link.js';
import Icon from '../components/icon.js';
import Head from '../components/head.js';

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
  model.checkIfIndexComplete();

  return (
    <>
      <Head url={url} title="Logs" description="日記とかエッセイとか。" />
      <header>
        <h1>Logs</h1>
        <div className="meta">日記とかエッセイとか。</div>
      </header>
      <div id="body">
        {entries.map(i =>
          <div className="summary" key={getID(i)}>
            <h2><Link href={`/log/${getID(i)}`}>{i.title}</Link></h2>
            <div className="meta">
              <div className="number">#{getID(i)}</div>
              <div className="date"><Icon name="calenderIcon" /><div>{dateToString(new Date(i.created))}</div></div>
            </div>
            <p>{i.description}</p>
            <hr />
          </div>
        )}
      </div>
    </>
  );
}