import * as React from 'react';
import { Helmet } from 'react-helmet';

export interface ArticleType {
  publishedTime: string;
  modifiedTime: string;
}

export interface HeadProps {
  url: string;
  title?: string;
  description: string;
  type?: 'website' | 'article';
  published?: string;
  modified?: string;
}

export default function Head(props: HeadProps) {
  const type = props.type ?? 'website';

  return (
    <>
      <Helmet>
        <title>{props.title == null ? "曆路喫茶館" : `${props.title} | 曆路喫茶館`}</title>
        <meta name="description" content={props.description} />
        <link rel="canonical" href={props.url} />
        <link rel="alternate" type="application/atom+xml" href="/feed.xml" />
        <meta property="og:locale" content="ja_JP" />
        <meta property="og:site_name" content="曆路喫茶館" />
        <meta property="og:url" content={props.url} />
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