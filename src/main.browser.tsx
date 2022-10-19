import * as React from 'react';
import * as ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { ModelProvider } from 'kyoka';

import { createRoutes } from './routes.js';
import { Data, Model } from './model.js';

import './styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'katex/dist/katex.min.css';
import '@fontsource/raleway';

window.addEventListener('load', async () => {
  const $hydrationData = document.getElementById('hydration-data') as HTMLScriptElement;
  const hydrationData = JSON.parse($hydrationData.text) as Data;
  const routeID = $hydrationData.dataset['routeId'] as string;
  const model = new Model(hydrationData);

  const router = createBrowserRouter(createRoutes(model), {
    hydrationData: {
      loaderData: {
        [routeID]: hydrationData
      }
    }
  });

  const root = ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <ModelProvider model={model}>
      <RouterProvider router={router} />
    </ModelProvider>
  );
});