import * as React from 'react';
import * as ReactDOM from 'react-dom/client'

import Root from './components/root.js';

import './assets/styles.css';
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

import logoFull from './assets/koyomiji_full_hr.svg?raw';
import mailIcon from '@tabler/icons/mail.svg?raw';
import githubIcon from '@tabler/icons/brand-github.svg?raw';
import youtubeIcon from '@tabler/icons/brand-youtube.svg?raw';
import twitchIcon from '@tabler/icons/brand-twitch.svg?raw';
import calenderIcon from '@tabler/icons/calendar-time.svg?raw';
import tagsIcon from '@tabler/icons/tags.svg?raw';
import asterisk from '/src/assets/asterisk.svg?raw';
import { InitialData, Model } from './model.js';
import { BrowserRouter } from 'react-router-dom';
import { ModelProvider } from 'kyoka';

window.addEventListener('load', async () => {
  const initialData = JSON.parse((document.getElementById('initial-data') as HTMLScriptElement).text) as InitialData;
  const model = new Model(initialData);
/*
  const root = ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <BrowserRouter>
      <ModelProvider model={model}>
        <Root />
      </ModelProvider>
    </BrowserRouter>
  );*/
});

function setIcon(query: string, svg: string) {
  const elements = Array.from(document.querySelectorAll(query));

  for (const i of elements) {
    i.outerHTML = svg;
  }
}

function loadIcons() {
  setIcon('.mail-icon', mailIcon);
  setIcon('.github-icon', githubIcon);
  setIcon('.youtube-icon', youtubeIcon);
  setIcon('.twitch-icon', twitchIcon);
  setIcon('.calender-icon', calenderIcon);
  setIcon('.tags-icon', tagsIcon);
  setIcon('.asterisk', asterisk);
  setIcon('#logo', logoFull);
}

async function loadHighlight() {
  if (document.querySelector('code') != null) {
    const prism = await import('./prism.js');
    prism.highlightAll();
  }
}

async function loadMath() {
  const mathBlocks = document.getElementsByClassName('math-block');
  const mathInlines = document.getElementsByClassName('math-inline');

  if ((mathBlocks.length + mathInlines.length) > 0) {
    const katex = (await import('katex')).default;

    for (const mathBlock of mathBlocks) {
      katex.render(mathBlock.textContent!, mathBlock as any, { displayMode: true });
    }

    for (const mathInline of mathInlines) {
      katex.render(mathInline.textContent!, mathInline as any);
    }
  }
}