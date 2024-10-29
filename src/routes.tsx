import * as React from 'react';
import { Routes, Route, Outlet, RouteObject } from 'react-router';
import AboutPage from "./pages/about-page";
import CommonLayout from '../app/routes/_common';
import IndexPage from "./pages/index-page";
import ReferenceIndexPage from "./pages/reference-index-page";
import ReferencePage from "./pages/reference-page";
import LogIndexPage from "./pages/log-index-page";
import LogPage from "./pages/log-page";
import NotFoundPage from './pages/not-found-page';
import ProjectPage from '../app/routes/_common.project';
import NovelIndexPage from './pages/novel-index-page';
import ArtworkIndexPage from './pages/artwork-index-page';
import NovelPage from './pages/novel-page';
import ArtworkPage from './pages/artwork-page';
import DictionaryPage from './pages/dictionary-page';
import { ScrollRestoration } from 'react-router-dom';
import { Model } from './model';
import { toPathname } from '../lib/utils';

function RootElement(props: any) {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    // Suppress warning on server
    setHydrated(true);
  }, []);

  return (
    <>
      <Outlet />
      {hydrated ? <ScrollRestoration /> : null}
    </>
  );
}

export function createRoutes(model: Model): RouteObject[] {
  return [
    {
      path: '/', element: <RootElement />, children: [
        {
          element: <CommonLayout />, children: [
            {
              index: true,
              id: '/',
              element: <IndexPage />,
              loader: () => fetch('/data.json').then(d => d.json())
            },
            {
              path: 'about',
              id: '/about',
              element: <AboutPage />
            },
            {
              path: 'project',
              id: '/project',
              element: <ProjectPage />
            },
            {
              path: 'reference/:category/:id',
              id: '/reference/:category/:id',
              element: <ReferencePage />,
              loader: ({ params }) => {
                const path = toPathname(['reference', params.category!, params.id!, 'data.json']);
                return fetch(path).then(d => d.json());
              }
            },
            {
              path: 'reference',
              id: '/reference',
              element: <ReferenceIndexPage />,
              loader: () => fetch('/data.json').then(d => d.json())
            },
            {
              path: 'log/:id',
              id: '/log/:id',
              element: <LogPage />,
              loader: ({ params }) => {
                const path = toPathname(['log', params.id!, 'data.json']);
                return fetch(path).then(d => d.json());
              }
            },
            {
              path: 'log',
              id: '/log',
              element: <LogIndexPage />,
              loader: () => fetch('/data.json').then(d => d.json())
            },
            {
              path: 'novel',
              id: '/novel',
              element: <NovelIndexPage />,
              loader: () => fetch('/data.json').then(d => d.json())
            },
            {
              path: 'artwork',
              id: '/artwork',
              element: <ArtworkIndexPage />,
              loader: () => fetch('/data.json').then(d => d.json())
            },
            {
              path: 'artwork/:id',
              id: '/artwork/:id',
              element: <ArtworkPage />,
              loader: ({ params }) => {
                const path = toPathname(['artwork', params.id!, 'data.json']);
                return fetch(path).then(d => d.json());
              }
            },
            {
              path: 'dictionary',
              id: '/dictionary',
              element: <DictionaryPage />
            },
            {
              path: '*',
              id: '/*',
              element: <NotFoundPage />
            },
          ]
        },
        {
          path: 'novel/:novel/:chapter',
          id: '/novel/:novel/:chapter',
          element: <NovelPage />,
          loader: ({ params }) => {
            const path = toPathname(['novel', params.novel!, params.chapter!, 'data.json']);
            return fetch(path).then(d => d.json());
          }
        }
      ]
    }
  ];
}