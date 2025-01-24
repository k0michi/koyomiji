import { Location, MetaDescriptor } from "react-router";
import SiteConfig from "./SiteConfig";
import URLHelper from "./URLHelper";

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
  const url = URLHelper.toString(pageMeta.location.pathname, SiteConfig.getInfo().url);
  const t = pageMeta.title == null ? SiteConfig.getInfo().name : `${pageMeta.title} | ${SiteConfig.getInfo().name}`;
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
    metaProperty('og:site_name', SiteConfig.getInfo().name),
    metaProperty('og:url', url),
    metaProperty('og:title', t),
    metaProperty('og:description', pageMeta.description),
    metaProperty('og:type', ogType),
    ...(type == 'article' ? [
      metaProperty('article:published_time', pageMeta.published!),
      metaProperty('article:modified_time', pageMeta.modified!),
    ] : []),
    metaName('twitter:card', 'summary'),
    metaName('twitter:site', SiteConfig.getInfo().twitterName),
    metaName('twitter:creator', SiteConfig.getInfo().twitterName),
  ]
}