import * as React from 'react';
import { useModel, useObservable } from 'kyoka';
import { useLocation, useParams } from 'react-router';
import { Model } from '../model.js';
import { toElement } from '../xml.js';
import * as ReactKTML from '../react-ktml.js';
import Icon from '../components/icon.js';
import { parseXML } from '../xml.js';
import Head from '../components/head.js';
import { toDisplayDateString } from '../date-format.js';

export default function ArtworkPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const params = useParams();
  const model = useModel<Model>();
  const path = ['artwork', params.id!];
  const entry = model.getEntry(path);
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);
  const assets = useObservable(model.assets);

  return (
    <>
      <Head url={url} title={entry.title} description={entry.description} type="article" published={entry.created} modified={entry.modified} />
      <img className="artwork" src={entry.source!} />
      <header>
        <h1>{entry.title}</h1>
        <div className="meta">
          <div className="number">#{params.id}</div>
          <div className="date"><Icon name="calenderIcon" /><div>{toDisplayDateString(new Date(entry.created))}</div></div>
        </div>
      </header>
      <div id="body">
        {content}
      </div>
    </>
  );
}