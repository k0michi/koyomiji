import * as React from 'react';
import { useModel, useObservable } from 'kyoka';
import { useLoaderData, useLocation, useParams } from 'react-router';
import { Data, Model } from '../model.js';
import { toElement } from '../../lib/xml.js';
import * as ReactKTML from '../react-ktml.js';
import { CalenderIcon } from '../components/icon.js';
import { parseXML } from '../../lib/xml.js';
import Head from '../components/head.js';
import { toDisplayDateString } from '../../lib/date-format.js';
import { toPathname } from '../../lib/utils.js';

export default function ArtworkPage() {
  const params = useParams();
  const path = ['artwork', params.id!];
  const data = useLoaderData() as Data;
  const entry = data.entries[toPathname(path)];
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);

  return (
    <>
      <Head title={entry.title} description={entry.description} type="article" published={entry.created} modified={entry.modified} />
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