import * as React from 'react';
import { Routes, Route, Outlet, RouteObject } from 'react-router';
import AboutPage from "./pages/about-page.js";
import MainLayout from './components/common-layout.js';
import IndexPage from "./pages/index-page.js";
import KnowledgeIndexPage from "./pages/knowledge-index-page.js";
import KnowledgePage from "./pages/knowledge-page.js";
import LogIndexPage from "./pages/log-index-page.js";
import LogPage from "./pages/log-page.js";
import NotFoundPage from './pages/not-found-page.js';
import ProjectPage from './pages/project-page.js';
import NovelIndexPage from './pages/novel-index-page.js';
import ArtworkIndexPage from './pages/artwork-index-page.js';
import NovelPage from './pages/novel-page.js';
import ArtworkPage from './pages/artwork-page.js';
import DictionaryPage from './pages/dictionary-page.js';
import { ScrollRestoration } from 'react-router-dom';
import { Model } from './model.js';

function RootElement(props: any) {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    // Suppress warning on server
    // Temporal fix for hydration error
    setTimeout(() => setHydrated(true), 1000);
  }, []);

  return (
    <>
      <React.Suspense fallback={<p>Loading</p>}>
        <Outlet />
      </React.Suspense>
      {hydrated ? <ScrollRestoration /> : null}
    </>
  );
}

export function createRoutes(model: Model): RouteObject[] {
  return [
    {
      path: '/', element: <RootElement />, children: [
        {
          element: <MainLayout />, children: [
            {
              index: true,
              element: <IndexPage />,
              loader: () => model.getIndex()
            },
            {
              path: 'about',
              element: <AboutPage />
            },
            {
              path: 'project',
              element: <ProjectPage />
            },
            {
              path: 'knowledge/:category/:id',
              element: <KnowledgePage />,
              loader: ({ params }) => {
                const path = ['knowledge', params.category!, params.id!];
                return model.getEntry(path);
              }
            },
            {
              path: 'knowledge',
              element: <KnowledgeIndexPage />,
              loader: () => model.getIndex()
            },
            {
              path: 'log/:id',
              element: <LogPage />,
              loader: ({ params }) => {
                const path = ['log', params.id!];
                return model.getEntry(path);
              }
            },
            {
              path: 'log',
              element: <LogIndexPage />,
              loader: () => model.getIndex()
            },
            {
              path: 'novel',
              element: <NovelIndexPage />,
              loader: () => model.getIndex()
            },
            {
              path: 'artwork',
              element: <ArtworkIndexPage />,
              loader: () => model.getIndex()
            },
            {
              path: 'artwork/:id',
              element: <ArtworkPage />,
              loader: ({ params }) => {
                const path = ['artwork', params.id!];
                return model.getEntry(path);
              }
            },
            {
              path: 'dictionary',
              element: <DictionaryPage />
            },
            {
              path: '*',
              element: <NotFoundPage />
            },
          ]
        },
        {
          path: 'novel/:novel/:chapter',
          element: <NovelPage />,
          loader: ({ params }) => {
            const path = ['novel', params.novel!, params.chapter!];
            return model.getEntry(path);
          }
        }
      ]
    }
  ];
}