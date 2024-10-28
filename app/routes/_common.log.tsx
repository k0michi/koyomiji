import * as React from 'react';
import { Entry } from "../../lib/entry.js";
import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation } from 'react-router';
import { CalenderIcon } from '../../components/icon.js';
import { toDisplayDateString } from '../../lib/date-format.js';
import { ServerModel } from 'lib/server-model.js';
import { getMeta } from 'lib/meta.js';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const index = await ServerModel.instance.getEntryIndex();
  return { entries: index };
}

function getID(p: Entry) {
  return p.path.split('/')[2];
}

export const meta: MetaFunction = ({ location }) => getMeta({
  location,
  title: "Logs",
  description: "取り止めのないブログ。"
});

export default function LogIndexPage() {
  const data = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const entries = Object.values(data.entries).filter(e => e.path.startsWith('/log/'));
  entries.sort((a, b) => getID(b).localeCompare(getID(a), undefined, { numeric: true }));

  return (
    <>
      <header>
        <h1>Logs</h1>
        <div className="meta">取り止めのないブログ。</div>
      </header>
      <div id="body">
        {entries.map(i =>
          <div className="summary" key={getID(i)}>
            <h2><Link to={`/log/${getID(i)}`}>{i.title}</Link></h2>
            <div className="meta">
              <div className="number">#{getID(i)}</div>
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