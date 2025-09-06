import * as React from 'react';
import { Link, LoaderFunctionArgs, MetaFunction, useLoaderData, useLocation, useParams } from 'react-router';
import { XIcon } from '../../components/icon';
import ServerModel from 'lib/ServerModel';
import { getMeta } from 'lib/meta';
import { Handle } from '~/Handle';
import { useDevReload } from '~/Hook.index';
import KTML from 'components/KTML';
import { Route } from './+types/novel.$novel.$';

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

// FIXME:
// export const loader = async ({ params }: LoaderFunctionArgs) => {
//   return await ServerModel.instance.getEntry(`/novel/${params.novel}/${params.chapter}`);
// }

export const loader = async ({ params }: Route.LoaderArgs) => {
  let path = `/novel/${params.novel}`;

  if (params['*']) {
    path += `/${params['*']}`;
  }

  return await ServerModel.instance.getEntry(path);
}

export const meta = ({ location, data }: Route.MetaArgs) => {
  return data ? getMeta({
    location,
    title: data.title,
    description: data.description,
    type: 'article',
    published: data.created,
    modified: data.modified,
  }) : [];
};

export const handle: Handle = () => {
  return {
    body: {
      className: 'novel-layout'
    }
  };
}

export default function NovelPage() {
  const data = useLoaderData<typeof loader>();
  const entry = data;
  const mainRef = React.useRef<HTMLElement>(null);
  // useDevReload();

  // React.useEffect(() => {
  //   const h = (e: any) => {
  //     if (e.deltaX == 0) {
  //       window.scrollBy(-e.deltaY, 0);
  //       e.preventDefault()
  //     }
  //   };

  //   window.addEventListener('wheel', h, { passive: false });
  //   return () => window.removeEventListener('wheel', h);
  // }, []);

  // React.useEffect(() => {
  //   const rLocation = loadLocation(location.pathname) ?? 0;
  //   const elem = mainRef.current?.children!.item(rLocation);
  //   const rect = elem?.getBoundingClientRect();
  //   window.scrollBy(rect?.left! - window.innerWidth + rect?.width!, 0);

  //   let options = {
  //     rootMargin: '0px',
  //     threshold: 1.0
  //   }

  //   let intersectingSet = new Set<Element>();
  //   let lastCalculated = Date.now();

  //   let observer = new IntersectionObserver((entries, observer) => {
  //     for (const entry of entries) {
  //       if (entry.isIntersecting) {
  //         intersectingSet.add(entry.target);
  //       } else {
  //         intersectingSet.delete(entry.target);
  //       }

  //       const now = Date.now();

  //       if (now - lastCalculated > 1000) {
  //         let min = Number.MAX_VALUE;

  //         for (const e of intersectingSet.values()) {
  //           const index = indexOf(mainRef.current?.children!, e);

  //           if (index < min) {
  //             min = index;
  //           }
  //         }

  //         if (min != Number.MAX_VALUE) {
  //           saveLocation(location.pathname, min);
  //           lastCalculated = now;
  //         }
  //       }
  //     }
  //   }, options);

  //   for (const elem of mainRef.current?.children!) {
  //     observer.observe(elem);
  //   }
  // }, []);

  return (
    <>
      <div id="novel-nav">
        <Link to='/novel'><XIcon /></Link>
      </div>
      <main id="novel-main" ref={mainRef}>
        <KTML content={entry.content!} />
      </main>
    </>
  );
}