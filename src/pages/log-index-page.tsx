import * as React from 'react';
import { useModel, useObservable } from 'kyoka';
import { Entry } from "../entry.js";
import { Data, Model } from '../model.js';
import { useLoaderData, useLocation } from 'react-router';
import Link from '../components/link.js';
import Icon from '../components/icon.js';
import Head from '../components/head.js';
import { toDisplayDateString } from '../date-format.js';
import { useBufferedData } from '../hooks.js';

function getID(p: Entry) {
  return p.path[1];
}

export default function LogIndexPage() {
  const data = useBufferedData<Data>();
  const model = useModel<Model>();
  const entries = Object.values(data.entries).filter(e => e.path[0] == 'log');
  entries.sort((a, b) => getID(b).localeCompare(getID(a), undefined, { numeric: true }));
  const assets = useObservable(model.assets);

  return (
    <>
      <Head title="Logs" description="日記とかエッセイとか。" />
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
              <div className="date"><Icon name="calenderIcon" /><div>{toDisplayDateString(new Date(i.created))}</div></div>
            </div>
            <p>{i.description}</p>
            <hr />
          </div>
        )}
      </div>
    </>
  );
}