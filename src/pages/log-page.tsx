import * as React from 'react';
import { useModel, useObservable } from 'kyoka';
import { useLoaderData, useLocation, useParams } from 'react-router';
import { Data, Model } from '../model.js';
import { toElement } from '../xml.js';
import { parseXML } from '../xml.js';
import * as ReactKTML from '../react-ktml.js';
import { CalenderIcon } from '../components/icon.js';
import Head from '../components/head.js';
import { toDisplayDateString } from '../date-format.js';
import { Entry } from '../entry.js';
import { toPathname } from '../utils.js';

export default function LogPage() {
  const params = useParams();
  const path = ['log', params.id!];
  const data = useLoaderData() as Data;
  const entry = data.entries[toPathname(path)];
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);

  return (
    <>
      <Head title={entry.title} description={entry.description} type="article" published={entry.created} modified={entry.modified} />
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