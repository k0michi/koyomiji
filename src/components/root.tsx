import * as React from 'react';
import { Routes, Route } from 'react-router';
import AboutPage from "../pages/about-page.js";
import Frame from './frame.js';
import IndexPage from "../pages/index-page.js";
import KnowledgeIndexPage from "../pages/knowledge-index-page.js";
import KnowledgePage from "../pages/knowledge-page.js";
import LogIndexPage from "../pages/log-index-page.js";
import LogPage from "../pages/log-page.js";
import NotFoundPage from '../pages/not-found-page.js';
import ProjectPage from '../pages/project-page.js';

export default function Root(props: any) {
  return (
    <Routes>
      <Route path="/" element={<Frame/>}>
        <Route index element={<IndexPage />}></Route>
        <Route path="about" element={<AboutPage />} />
        <Route path="project" element={<ProjectPage />} />
        <Route path="knowledge/:category/:id" element={<KnowledgePage />} />
        <Route path="knowledge" element={<KnowledgeIndexPage />} />
        <Route path="log/:id" element={<LogPage />} />
        <Route path="log" element={<LogIndexPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}