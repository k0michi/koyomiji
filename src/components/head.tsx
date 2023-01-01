import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

export interface ArticleType {
  publishedTime: string;
  modifiedTime: string;
}

export interface HeadProps {
  title?: string;
  description: string;
  type?: 'general' | 'article';
  published?: string;
  modified?: string;
}

export default function Head(props: HeadProps) {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const type = props.type ?? 'general';

  return (
    <>
      <Helmet>
        <title>{props.title == null ? "喫茶＊曆路" : `${props.title} | 喫茶＊曆路`}</title>
        <meta name="description" content={props.description} />
        <link rel="canonical" href={url} />
        <link rel="alternate" type="application/atom+xml" href="/feed.xml" />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:site_name" content="喫茶＊曆路" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />
        <meta property="og:type" content={type} />
      </Helmet>
      {type == 'article' ?
        <Helmet>
          <meta property="article:published_time" content={props.published} />
          <meta property="article:modified_time" content={props.modified} />
        </Helmet>
        : null}
      <Helmet>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@k0michi" />
        <meta name="twitter:creator" content="@k0michi" />
      </Helmet>
    </>
  );
}