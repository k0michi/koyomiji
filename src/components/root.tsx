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

export function Root(props: any) {
  return (
    <Routes>
      <Route path="/" element={<Frame/>}>
        <Route index element={<IndexPage {...props} />}></Route>
        <Route path="about" element={<AboutPage {...props} />} />
        <Route path="knowledge/:category/:id" element={<KnowledgePage {...props} />} />
        <Route path="knowledge" element={<KnowledgeIndexPage {...props} />} />
        <Route path="log/:id" element={<LogPage {...props} />} />
        <Route path="log" element={<LogIndexPage {...props} />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}