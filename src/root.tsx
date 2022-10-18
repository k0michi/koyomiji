import * as React from 'react';
import { Routes, Route, Outlet } from 'react-router';
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

export default function Root(props: any) {
  return (
    <Route path="/" element={<RootElement />}>
      <Route element={<MainLayout />}>
        <Route index element={<IndexPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="project" element={<ProjectPage />} />
        <Route path="knowledge/:category/:id" element={<KnowledgePage />} />
        <Route path="knowledge" element={<KnowledgeIndexPage />} />
        <Route path="log/:id" element={<LogPage />} />
        <Route path="log" element={<LogIndexPage />} />
        <Route path="novel" element={<NovelIndexPage />} />
        <Route path="artwork" element={<ArtworkIndexPage />} />
        <Route path="artwork/:id" element={<ArtworkPage />} />
        <Route path="dictionary" element={<DictionaryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="novel/:novel/:chapter" element={<NovelPage />} />
    </Route>
  );
}