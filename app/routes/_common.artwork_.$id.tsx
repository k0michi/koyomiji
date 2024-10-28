import * as React from 'react';
import { LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation, useParams } from 'react-router';
import { toElement } from '../../lib/xml.js';
import { parseXML } from '../../lib/xml.js';
import * as ReactKTML from '../../lib/react-ktml.js';
import { CalenderIcon } from '../../components/icon.js';
import { toDisplayDateString } from '../../lib/date-format.js';
import { ServerModel } from 'lib/server-model.js';
import { getMeta } from 'lib/meta.js';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await ServerModel.instance.getEntry(`/artwork/${params.id}`);
}

type Data = Awaited<ReturnType<typeof loader>>;

export const meta: MetaFunction = ({ location, data }) => getMeta({
  location,
  title: (data as Data).title,
  description: (data as Data).description,
  type: 'article',
  published: (data as Data).created,
  modified: (data as Data).modified,
});

export default function ArtworkPage() {
  const data = useLoaderData() as Data;
  const params = useParams();
  const entry = data;
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);

  return (
    <>
      <img className="artwork" src={entry.source!} />
      <header>
        <h1>{entry.title}</h1>
        <div className="meta">
          <div className="number">#{params.id}</div>
          <div className="date"><CalenderIcon /><div>{toDisplayDateString(new Date(entry.created))}</div></div>
        </div>
      </header>
      <div id="body">
        {content}
      </div>
    </>
  );
}