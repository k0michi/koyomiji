import * as React from 'react';
import { Entry } from "../../lib/Entry.index";
import { Link, useLoaderData } from 'react-router';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import DateHelper from 'lib/DateHelper';
import { Route } from './+types/_common.artwork';

export const loader = async ({ params }: Route.LoaderArgs) => {
  const index = await ServerModel.instance.getEntryIndex();
  return { entries: index };
}

export const meta = ({ location }: Route.MetaArgs) => getMeta({
  location,
  title: "Artworks",
  description: "描いた絵。"
});

export default function ArtworkIndexPage() {
  const data = useLoaderData<typeof loader>();
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/artwork'));
  entries.sort((a, b) => DateHelper.compareDates(new Date(b.created), new Date(a.created)));

  return (
    <>
      <header>
        <h1>Artworks</h1>
        <div className="meta">描いた絵。</div>
      </header>
      <div id="body">
        <div className="thumbnail-list">
          {entries.map(i =>
            <div className="thumbnail" key={i.path}>
              <Link to={i.path}>
                <img src={i.source!} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}