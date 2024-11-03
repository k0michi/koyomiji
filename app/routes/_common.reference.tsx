import * as React from 'react';
import { Entry, mapEntries } from "../../lib/entry";
import { getCategory } from '../../lib/config';
import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData } from 'react-router';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const index = await ServerModel.instance.getEntryIndex();
  return { entries: index };
}

type Data = Awaited<ReturnType<typeof loader>>;

export const meta: MetaFunction = ({ location }) => getMeta({
  location,
  title: "Reference",
  description: "学んだことの覚書。"
});

export default function ReferenceIndexPage() {
  const data = useLoaderData() as Data;
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