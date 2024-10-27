import * as React from 'react';
import CalenderGraph from '../components/calender-graph.js';
import Head from '../components/head.js';
import Link from '../components/link.js';
import { subDays } from 'date-fns';
import { Data, Model } from '../model.js';
import * as config from '../config.js';
import { toDisplayDateString } from '../../lib/date-format.js';
import { getPathSegment } from '../utils.js';
import { useLoaderData } from 'react-router';
import { CalenderIcon } from '../components/icon.js';

export default function IndexPage() {
  const data = useLoaderData() as Data;
  const entries = Object.values(data.entries);

  const now = new Date();
  const begin = subDays(now, 364);
  const featured = config.getFeatured();

  return (
    <>
      <Head description="ようこそ、喫茶＊曆路へ。" />
      <header>
        <h1>Welcome</h1>
        <div className="meta">ようこそ、喫茶＊曆路へ。</div>
      </header>
      <div id="body">
        <h2>Updates</h2>
        <CalenderGraph begin={begin} end={now} data={entries.map(e => new Date(e.created))} />
        <h2>Featured</h2>
        {featured.map(f => data.entries[f]).map(i =>
          <div className="summary" key={getPathSegment(i.path, 1)}>
            <h3><Link href={`/log/${getPathSegment(i.path, 1)}`}>{i.title}</Link></h3>
            <div className="meta">
              <div className="number">#{getPathSegment(i.path, 1)}</div>
              <div className="date"><CalenderIcon /><div>{toDisplayDateString(new Date(i.created))}</div></div>
            </div>
            <p>{i.description}</p>
            <hr />
          </div>
        )}
      </div>
    </>
  );
}