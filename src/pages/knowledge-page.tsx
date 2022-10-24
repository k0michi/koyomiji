import * as React from 'react';
import { useModel, useObservable } from 'kyoka';
import { useLoaderData, useLocation, useParams, useRouteLoaderData } from 'react-router';
import { Data, Model } from '../model.js';
import { toElement } from '../xml.js';
import { parseXML } from '../xml.js';
import * as ReactKTML from '../react-ktml.js';
import Icon from '../components/icon.js';
import Head from '../components/head.js';
import { toDisplayDateString } from '../date-format.js';
import { toPathname } from '../utils.js';
import { useBufferedData } from '../hooks.js';
import { getCategory } from '../config.js';

export default function KnowledgePage() {
  const params = useParams();
  const path = ['knowledge', params.category!, params.id!];
  const data = useBufferedData<Data>();
  const entry = data.entries[toPathname(path)];
  const categoryName = getCategory(params.category!).name;
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);

  return (
    <>
      <Head title={entry.title} description={entry.description} type="article" published={entry.created} modified={entry.modified} />
      <header>
        <h1>{entry.title}</h1>
        <div className="meta">
          <div className="date"><Icon name="calenderIcon" /><div>{toDisplayDateString(new Date(entry.created))}</div></div>
          <div className="tags"><Icon name="tagsIcon" /><div>{categoryName}</div></div>
        </div>
      </header>
      <div id="body">
        {content}
      </div>
    </>
  );
}