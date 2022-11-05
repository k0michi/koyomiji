import * as React from 'react';
import { useModel, useObservable } from 'kyoka';
import { Entry } from "../entry.js";
import { Data, Model } from '../model.js';
import { useLoaderData, useLocation } from 'react-router';
import Link from '../components/link.js';
import Icon from '../components/icon.js';
import Head from '../components/head.js';
import { toDisplayDateString } from '../date-format.js';

function getID(p: Entry) {
  return p.path.split('/')[2];
}

export default function LogIndexPage() {
  const data = useLoaderData() as Data;
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/log/'));
  entries.sort((a, b) => getID(b).localeCompare(getID(a), undefined, { numeric: true }));

  return (
    <>
      <Head title="Logs" description="ブログ。日記やエッセイなど。" />
      <header>
        <h1>Logs</h1>
        <div className="meta">ブログ。日記やエッセイなど。</div>
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