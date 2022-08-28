import * as React from 'react';
import { Helmet } from 'react-helmet';
import dateToString from "../date-format.js";
import { useModel, useObservable } from 'kyoka';
import { useLocation, useParams } from 'react-router';
import { Model } from '../model.js';
import { compareArray } from '../utils.js';
import { parseXML, toElement } from '../ktml.js';
import * as ReactKTML from '../react-ktml.js';
import Icon from './icon.js';

export default function LogPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const params = useParams();
  const model = useModel<Model>();
  const path = ['log', params.id!];
  const entry = model.getEntry(path);
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);
  const assets = useObservable(model.assets);

  return (
    <>
      <Helmet>
        <title>{entry.title} | 曆路喫茶館</title>
        <meta name="description" content={entry.description} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={entry.title} />
        <meta property="og:description" content={entry.description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
      </Helmet>
      <header>
        <h1>{entry.title}</h1>
        <div className="meta">
          <div className="number">#{params.id}</div>
          <div className="date"><Icon name="calenderIcon" /><div>{dateToString(new Date(entry.created))}</div></div>
        </div>
      </header>
      {content}
    </>
  );
}