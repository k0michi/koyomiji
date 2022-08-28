import * as React from 'react';
import { Helmet } from 'react-helmet';
import { categoryNames } from "../category.js";
import dateToString from "../date-format.js";
import { useModel, useObservable } from 'kyoka';
import { useLocation, useParams } from 'react-router';
import { Model } from '../model.js';
import { compareArray } from '../utils.js';
import { parseXML, toElement } from '../ktml.js';
import * as ReactKTML from '../react-ktml.js';

export default function KnowledgePage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const params = useParams();
  const model = useModel<Model>();
  const path = ['knowledge', params.category!, params.id!];
  const entry = model.getEntry(path);
  const categoryName = categoryNames[params.category!];
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);

  return (
    <>
      <Helmet>
        <title>[{categoryName}] {entry.title} | 曆路喫茶館</title>
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
          <div className="date"><div className="calender-icon"></div><div>{dateToString(new Date(entry.created))}</div></div>
          <div className="tags"><div className="tags-icon"></div><div>{categoryName}</div></div>
        </div>
      </header>
      {content}
    </>
  );
}