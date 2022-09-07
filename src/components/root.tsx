import * as React from 'react';
import { Routes, Route } from 'react-router';
import AboutPage from "../pages/about-page.js";
import MainLayout from './main-layout.js';
import IndexPage from "../pages/index-page.js";
import KnowledgeIndexPage from "../pages/knowledge-index-page.js";
import KnowledgePage from "../pages/knowledge-page.js";
import LogIndexPage from "../pages/log-index-page.js";
import LogPage from "../pages/log-page.js";
import NotFoundPage from '../pages/not-found-page.js';
import ProjectPage from '../pages/project-page.js';
import NovelIndexPage from '../pages/novel-index-page.js';
import ArtworkIndexPage from '../pages/artwork-index-page.js';
import NovelPage from '../pages/novel-page.js';
import { useModel } from 'kyoka';
import { Model } from '../model.js';
import ArtworkPage from '../pages/artwork-page.js';
import DictionaryPage from '../pages/dictionary-page.js';

export default function Root(props: any) {
  return (
    <React.Suspense fallback={<p>Loading</p>}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<IndexPage />}></Route>
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
        <Route path="/novel/:novel/:chapter" element={<NovelPage />} />
      </Routes>
    </React.Suspense>
  );
}