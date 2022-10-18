import * as React from 'react';
import * as ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { ModelProvider } from 'kyoka';

import Root from './root.js';
import { InitialData, Model } from './model.js';

import './styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';
import '@fontsource/raleway';

window.addEventListener('load', async () => {
  const initialData = JSON.parse((document.getElementById('initial-data') as HTMLScriptElement).text) as InitialData;
  const model = new Model(initialData);

  const router = createBrowserRouter(createRoutesFromElements(Root({})));

  const root = ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <ModelProvider model={model}>
      <RouterProvider router={router} />
    </ModelProvider>
  );
});