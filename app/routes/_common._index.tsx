import * as React from 'react';
import CalenderGraph from '../../components/calender-graph.js';
import { subDays } from 'date-fns';
import * as config from '../../lib/config.js';
import { toDisplayDateString } from '../../lib/date-format.js';
import { getPathSegment } from '../../lib/utils.js';
import { Link, LoaderFunction, LoaderFunctionArgs, MetaFunction, useLoaderData } from 'react-router';
import { CalenderIcon } from '../../components/icon.js';
import { ServerModel } from 'lib/server-model.js';
import { getMeta } from 'lib/meta.js';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const index = await ServerModel.instance.getEntryIndex();
  return { entries: index };
}

export const meta: MetaFunction = ({ location }) => getMeta({
  location,
  description: "ようこそ、喫茶＊曆路へ。"
});

export default function IndexPage() {
  const data = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const entries = Object.values(data.entries);

  const now = new Date();
  const begin = subDays(now, 364);
  const featured = config.getFeatured();

  return (
    <>
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
            <h3><Link to={`/log/${getPathSegment(i.path, 1)}`}>{i.title}</Link></h3>
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