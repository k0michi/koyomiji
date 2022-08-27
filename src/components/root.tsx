import * as React from 'react';
import { Routes, Route } from 'react-router';
import AboutPage from "./about-page.js";
import Frame from './frame.js';
import IndexPage from "./index-page.js";
import KnowledgeIndexPage from "./knowledge-index-page.js";
import KnowledgePage from "./knowledge-page.js";
import LogIndexPage from "./log-index-page.js";
import LogPage from "./log-page.js";
import NotFound from './not-found.js';
import ProjectPage from './project-page.js';

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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}