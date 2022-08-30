import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Entry } from "../entry.js";
import { useLocation, useParams } from 'react-router';
import Link from '../components/link.js';
import { useModel, useObservable } from 'kyoka';
import { Model } from '../model.js';
import { parseXML, toElement } from '../ktml.js';
import * as ReactKTML from '../react-ktml.js';
import Icon from '../components/icon.js';

function getID(p: Entry) {
  return p.path[1];
}

export default function NovelPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const params = useParams();
  const model = useModel<Model>();
  const path = ['novel', params.novel!, params.chapter!];
  const entry = model.getEntry(path);
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);
  const assets = useObservable(model.assets);

  React.useEffect(() => {
    document.documentElement.scrollLeft = document.documentElement.scrollWidth;
  }, []);

  return (
    <>
      <Helmet>
        <title>Novels | 曆路喫茶館</title>
        <meta name="description" content="" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content="Novels" />
        <meta property="og:description" content="" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
        <body className="novel-layout" />
      </Helmet>
      <div id="novel-nav">
        <Link href='/novel'><Icon name="xIcon" /></Link>
      </div>
      <main id="novel-main">
        {content}
      </main>
    </>
  );
}