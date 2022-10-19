import * as React from 'react';
import { useLoaderData, useLocation, useParams } from 'react-router';
import Link from '../components/link.js';
import { useModel, useObservable } from 'kyoka';
import { Data, Model } from '../model.js';
import { toElement } from '../xml.js';
import { parseXML } from '../xml.js';
import * as ReactKTML from '../react-ktml.js';
import Icon from '../components/icon.js';
import Head from '../components/head.js';
import { Helmet } from 'react-helmet';
import { Entry } from '../entry.js';
import { toPathname } from '../utils.js';
import { useBufferedData } from '../hooks.js';

interface NovelStorage {
  locations: Record<string, number | undefined>;
}

function indexOf(elements: HTMLCollection, element: Element) {
  let i = 0;

  for (const e of elements) {
    if (e == element) {
      return i;
    }

    i++;
  }

  return -1;
}

function getNovelStorage() {
  const stored = localStorage.getItem('novel');
  const current = (stored != null ? JSON.parse(stored) : { locations: {} }) as NovelStorage;
  return current;
}

function loadLocation(pathname: string) {
  const current = getNovelStorage();
  return current.locations[pathname];
}

function saveLocation(pathname: string, location: number) {
  const current = getNovelStorage();
  current.locations[pathname] = location;
  localStorage.setItem('novel', JSON.stringify(current));
}

export default function NovelPage() {
  const location = useLocation();
  const url = `https://koyomiji.com${location.pathname}`;
  const params = useParams();
  const path = ['novel', params.novel!, params.chapter!];
  const data = useBufferedData<Data>();
  const entry = data.entries[toPathname(path)];
  const model = useModel<Model>();
  const content = toElement(parseXML(entry.content!).firstChild?.childNodes!, ReactKTML.reactFactory);
  const mainRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    model.fetchAssets();
  }, []);

  React.useEffect(() => {
    const h = (e: any) => {
      if (e.deltaX == 0) {
        window.scrollBy(-e.deltaY, 0);
        e.preventDefault()
      }
    };

    window.addEventListener('wheel', h, { passive: false });
    return () => window.removeEventListener('wheel', h);
  }, []);

  React.useEffect(() => {
    const rLocation = loadLocation(location.pathname) ?? 0;
    const elem = mainRef.current?.children!.item(rLocation);
    const rect = elem?.getBoundingClientRect();
    window.scrollBy(rect?.left! - window.innerWidth + rect?.width!, 0);

    let options = {
      rootMargin: '0px',
      threshold: 1.0
    }

    let intersectingSet = new Set<Element>();
    let lastCalculated = Date.now();

    let observer = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          intersectingSet.add(entry.target);
        } else {
          intersectingSet.delete(entry.target);
        }

        const now = Date.now();

        if (now - lastCalculated > 1000) {
          let min = Number.MAX_VALUE;

          for (const e of intersectingSet.values()) {
            const index = indexOf(mainRef.current?.children!, e);

            if (index < min) {
              min = index;
            }
          }

          if (min != Number.MAX_VALUE) {
            saveLocation(location.pathname, min);
            lastCalculated = now;
          }
        }
      }
    }, options);

    for (const elem of mainRef.current?.children!) {
      observer.observe(elem);
    }
  }, []);

  return (
    <>
      <Head url={url} title={entry.title} description="" type="article" published={entry.created} modified={entry.modified} />
      <Helmet>
        <body className="novel-layout" />
      </Helmet>
      <div id="novel-nav">
        <Link href='/novel'><Icon name="xIcon" /></Link>
      </div>
      <main id="novel-main" ref={mainRef}>
        {content}
      </main>
    </>
  );
}