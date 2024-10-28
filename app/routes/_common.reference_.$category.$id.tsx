import * as React from 'react';
import { LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation, useParams, useRouteLoaderData } from 'react-router';
import { toElement } from '../../lib/xml.js';
import { parseXML } from '../../lib/xml.js';
import * as ReactKTML from '../../lib/react-ktml.js';
import { CalenderIcon, TagsIcon } from '../../components/icon.js';
import { toDisplayDateString } from '../../lib/date-format.js';
import { toPathname } from '../../lib/utils.js';
import { getCategory } from '../../lib/config.js';
import { ServerModel } from 'lib/server-model.js';
import { getMeta } from 'lib/meta.js';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return await ServerModel.instance.getEntry(`/reference/${params.category}/${params.id}`);
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

export default function ReferencePage() {
  const data = useLoaderData() as Data;
  const params = useParams();
  const entry = data;
  const categoryName = getCategory(params.category!).name;
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);

  return (
    <>
      <header>
        <h1>{entry.title}</h1>
        <div className="meta">
          <div className="date"><CalenderIcon /><div>{toDisplayDateString(new Date(entry.created))}</div></div>
          <div className="tags"><TagsIcon /><div>{categoryName}</div></div>
        </div>
      </header>
      <div id="body">
        {content}
      </div>
    </>
  );
}