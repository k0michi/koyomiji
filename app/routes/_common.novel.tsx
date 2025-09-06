import * as React from 'react';
import { Entry, mapEntries } from "../../lib/Entry.index";
import { Link, useLoaderData } from 'react-router';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import { Route } from './+types/_common.novel';

export const loader = async ({ params }: Route.LoaderArgs) => {
  const index = await ServerModel.instance.getEntryIndex();
  return { entries: index };
}

export const meta = ({ location, data }: Route.MetaArgs) => getMeta({
  location,
  title: "Novels",
  description: "艦これSSなど。"
});

export default function NovelIndexPage() {
  const data = useLoaderData<typeof loader>();
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/novel'));
  const map = mapEntries(entries);

  return (
    <>
      <header>
        <h1>Novels</h1>
        <div className="meta">艦これSSなど。</div>
      </header>
      <div id="body">
        {Object.entries(map).map(([k, v]) =>
          <div className="category" key={k}>
            <h2>{k}</h2>
            <ol>
              {v.map(i => <li key={i.path}><Link to={i.path}>{i.title}</Link></li>)}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}