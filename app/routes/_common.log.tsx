import * as React from 'react';
import { Entry } from "../../lib/Entry.index";
import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation } from 'react-router';
import { CalenderIcon, RefreshIcon } from '../../components/icon';
import { toDisplayDateString } from '../../lib/DateFormat.index';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';

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