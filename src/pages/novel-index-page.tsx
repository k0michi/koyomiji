import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useModel, useObservable } from 'kyoka';
import dateToString from '../date-format.js';
import { Entry } from "../entry.js";
import { Model } from '../model.js';
import { useLocation } from 'react-router';
import Link from '../components/link.js';
import Icon from '../components/icon.js';

function getID(p: Entry) {
  return p.path[1];
}

export default function NovelIndexPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;

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
      </Helmet>
      <header>
        <h1>Novels</h1>
        <div className="meta"></div>
      </header>
    </>
  );
}