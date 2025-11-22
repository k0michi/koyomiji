import * as React from 'react';
import { Entry } from "../../lib/Entry.index";
import { Link, useLoaderData } from 'react-router';
import { CalenderIcon, RefreshIcon } from '../../components/icon';
import { toDisplayDateString } from '../../lib/DateFormat.index';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import { Route } from './+types/_common.fragment';

export const loader = async ({ params }: Route.LoaderArgs) => {
  const index = await ServerModel.instance.getEntryIndex();
  return { entries: index };
}

function getID(p: Entry) {
  return p.path.split('/')[2];
}

export const meta = ({ location, data }: Route.MetaArgs) => getMeta({
  location,
  title: "Fragments",
  description: "とりあえず書いただけのメモ書き。",
});

export default function FragmentIndexPage() {
  const data = useLoaderData<typeof loader>();
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/fragment/'));
  entries.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  return (
    <>
      <header>
        <h1>Fragments</h1>
        <div className="meta">とりあえず書いただけのメモ書き。</div>
      </header>
      <div id="body">
        {entries.map(i =>
          <div className="summary" key={getID(i)}>
            <h2><Link to={`/fragment/${getID(i)}`}>{i.title}</Link></h2>
            <div className="meta">
              <div className="number">#{getID(i)}</div>
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