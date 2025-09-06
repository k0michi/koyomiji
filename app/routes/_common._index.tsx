import * as React from 'react';
import CalenderGraph from '../../components/calender-graph';
import { subDays } from 'date-fns';
import * as config from '../../lib/SiteConfig';
import { toDisplayDateString } from '../../lib/DateFormat.index';
import { getPathSegment } from '../../lib/utils';
import { Link, LoaderFunction, LoaderFunctionArgs, MetaFunction, useLoaderData } from 'react-router';
import { CalenderIcon, RefreshIcon } from '../../components/icon';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import { Route } from './+types/_common._index';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const index = await ServerModel.instance.getEntryIndex();
  return { entries: index };
}

export const meta = ({ location }: Route.MetaArgs) => getMeta({
  location,
  description: "ようこそ。"
});

export default function IndexPage() {
  const data = useLoaderData<typeof loader>();
  const entries = Object.values(data.entries);

  const now = new Date();
  const begin = subDays(now, 364);
  const featured = config.getFeatured();

  return (
    <>
      <header>
        <h1>Welcome</h1>
        <div className="meta">ようこそ。</div>
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
              <div className="date"><RefreshIcon /><div>{toDisplayDateString(new Date(i.modified))}</div></div>
            </div>
            <p>{i.description}</p>
            <hr />
          </div>
        )}
      </div>
    </>
  );
}