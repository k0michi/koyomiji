import * as React from 'react';
import { useLoaderData, useLocation, useParams, useRouteLoaderData } from 'react-router';
import { Data, Model } from '../model.js';
import { toElement } from '../xml.js';
import { parseXML } from '../xml.js';
import * as ReactKTML from '../react-ktml.js';
import { CalenderIcon, TagsIcon } from '../components/icon.js';
import Head from '../components/head.js';
import { toDisplayDateString } from '../date-format.js';
import { toPathname } from '../utils.js';
import { getCategory } from '../config.js';
import { getLocation } from '../document.js';
import Breadcrumb from '../components/breadcrumb.js';

export default function ReferencePage() {
  const params = useParams();
  const path = ['reference', params.id!];
  const data = useLoaderData() as Data;
  const entry = data.entries[toPathname(path)];
  const location = getLocation(entry);
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);

  return (
    <>
      <Head title={entry.title} description={entry.description} type="article" published={entry.created} modified={entry.modified} />
      <header>
        <div className='meta'><Breadcrumb links={[
          { name: '/' },
          ...location.map(l => { return { name: getCategory(l)?.name }; }),
          { name: entry.title }
        ]} /></div>
        <h1>{entry.title}</h1>
        <div className="meta">
          <div className="date"><CalenderIcon /><div>{toDisplayDateString(new Date(entry.created))}</div></div>
          {/*<div className="tags"><Icon name="tagsIcon" /><div></div></div>*/}
        </div>
      </header>
      <div id="body">
        {content}
      </div>
    </>
  );
}