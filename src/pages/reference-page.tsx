import * as React from 'react';
import { useLoaderData, useLocation, useParams, useRouteLoaderData } from 'react-router';
import { Data, Model } from '../model.js';
import { toElement } from '../../lib/xml.js';
import { parseXML } from '../../lib/xml.js';
import * as ReactKTML from '../react-ktml.js';
import { CalenderIcon, TagsIcon } from '../components/icon.js';
import Head from '../components/head.js';
import { toDisplayDateString } from '../../lib/date-format.js';
import { toPathname } from '../../lib/utils.js';
import { getCategory } from '../../lib/config.js';

export default function ReferencePage() {
  const params = useParams();
  const path = ['reference', params.category!, params.id!];
  const data = useLoaderData() as Data;
  const entry = data.entries[toPathname(path)];
  const categoryName = getCategory(params.category!).name;
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);

  return (
    <>
      <Head title={entry.title} description={entry.description} type="article" published={entry.created} modified={entry.modified} />
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