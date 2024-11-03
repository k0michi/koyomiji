import * as React from 'react';
import { Entry } from "../../lib/entry";
import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation } from 'react-router';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const index = await ServerModel.instance.getEntryIndex();
  return { entries: index };
}

type Data = Awaited<ReturnType<typeof loader>>;

export const meta: MetaFunction = ({ location }) => getMeta({
  location,
  title: "Artworks",
  description: "描いたイラスト。"
});

function getID(p: Entry) {
  return p.path[1];
}

export default function ArtworkIndexPage() {
  const data = useLoaderData() as Data;
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/artwork'));
  entries.sort((a, b) => getID(b).localeCompare(getID(a), undefined, { numeric: true }));

  return (
    <>
      <header>
        <h1>Artworks</h1>
        <div className="meta">描いたイラスト。</div>
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