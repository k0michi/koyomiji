import * as React from 'react';
import { Entry, mapEntries } from "../../lib/Entry.index";
import { getCategory } from '../../lib/SiteConfig';
import { Link, useLoaderData } from 'react-router';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import { Route } from './+types/_common.reference';

export const loader = async ({ params }: Route.LoaderArgs) => {
  const index = await ServerModel.instance.getEntryIndex();
  return { entries: index };
}

export const meta = ({ location }: Route.MetaArgs) => getMeta({
  location,
  title: "Reference",
  description: "学んだことの覚書。"
});

export default function ReferenceIndexPage() {
  const data = useLoaderData<typeof loader>();
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/reference/'));
  const map = mapEntries(entries);

  return (
    <>
      <header>
        <h1>Reference</h1>
        <div className="meta">学んだことの覚書。</div>
      </header>
      <div id="body">
        {Object.entries(map).map(([k, v]) =>
          <div className="category" key={k}>
            <h2>{getCategory(k)?.name}</h2>
            <ul>
              {v.map(i => <li key={i.path}><Link to={i.path}>{i.title}</Link></li>)}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}