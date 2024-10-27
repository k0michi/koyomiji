import { Location, MetaDescriptor } from "react-router";

export interface PageMeta {
  location: Location;
  title?: string;
  description: string;
  type?: 'general' | 'article';
  published?: string;
  modified?: string;
}

function title(title: string) {
  return {
    title
  };
}

function metaName(name: string, content: string) {
  return {
    name,
    content
  };
}

function metaProperty(property: string, content: string) {
  return {
    property,
    content
  };
}

function link(values: { [name: string]: string }) {
  return {
    tagName: 'link',
    ...values
  };
}

export function getMeta(pageMeta: PageMeta): MetaDescriptor[] {
  const url = `https://koyomiji.com${pageMeta.location.pathname}`;
  const t = pageMeta.title == null ? "喫茶＊曆路" : `${pageMeta.title} | 喫茶＊曆路`;
  const type = pageMeta.type ?? 'general';
  const ogType = type === 'article' ? 'article' : 'website';

  return [
    title(t),
    metaName('description', pageMeta.description),
    link({
      rel: 'canonical',
      href: url
    }),
    link({
      rel: 'alternate',
      type: 'application/atom+xml',
      href: '/feed.xml'
    }),
    metaProperty('og:locale', 'ja_JP'),
    metaProperty('og:site_name', '喫茶＊曆路'),
    metaProperty('og:url', url),
    metaProperty('og:title', t),
    metaProperty('og:description', pageMeta.description),
    metaProperty('og:type', ogType),
    ...(type == 'article' ? [
      metaProperty('article:published_time', pageMeta.published!),
      metaProperty('article:modified_time', pageMeta.modified!),
    ] : []),
    metaName('twitter:card', 'summary'),
    metaName('twitter:site', '@k0michi'),
    metaName('twitter:creator', '@k0michi'),
  ]
}