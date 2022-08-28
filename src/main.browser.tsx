import * as React from 'react';
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { ModelProvider } from 'kyoka';

import Root from './components/root.js';
import { InitialData, Model } from './model.js';

import './styles.css';
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

window.addEventListener('load', async () => {
  const initialData = JSON.parse((document.getElementById('initial-data') as HTMLScriptElement).text) as InitialData;
  const model = new Model(initialData);

  const root = ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <BrowserRouter>
      <ModelProvider model={model}>
        <Root />
      </ModelProvider>
    </BrowserRouter>
  );
});