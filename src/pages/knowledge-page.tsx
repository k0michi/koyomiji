import * as React from 'react';
import { categoryNames } from "../category.js";
import { useModel, useObservable } from 'kyoka';
import { useLocation, useParams } from 'react-router';
import { Model } from '../model.js';
import { toElement } from '../xml.js';
import { parseXML } from '../xml.js';
import * as ReactKTML from '../react-ktml.js';
import Icon from '../components/icon.js';
import Head from '../components/head.js';
import { toDisplayDateString } from '../date-format.js';

export default function KnowledgePage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const params = useParams();
  const model = useModel<Model>();
  const path = ['knowledge', params.category!, params.id!];
  const entry = model.getEntry(path);
  const categoryName = categoryNames[params.category!];
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);
  const assets = useObservable(model.assets);

  return (
    <>
      <Head url={url} title={entry.title} description={entry.description} type="article" published={entry.created} modified={entry.modified} />
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