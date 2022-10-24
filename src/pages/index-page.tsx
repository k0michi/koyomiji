import * as React from 'react';
import { useLoaderData, useLocation } from 'react-router';
import CalenderGraph from '../components/calender-graph.js';
import Head from '../components/head.js';
import Link from '../components/link.js';
import { subDays } from 'date-fns';
import { Data, Model } from '../model.js';
import { useBufferedData } from '../hooks.js';
import * as config from '../config.js';
import Icon from '../components/icon.js';
import { toDisplayDateString } from '../date-format.js';
import { getPathSegment } from '../utils.js';

export default function IndexPage() {
  const data = useBufferedData<Data>();
  const entries = Object.values(data.entries);

  const now = new Date();
  const begin = subDays(now, 364);
  const featured = config.getFeatured();

  return (
    <>
      <Head description="ようこそ、喫茶曆路へ。" />
      <header>
        <h1>Home</h1>
        <div className="meta">ようこそ、喫茶曆路へ。</div>
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