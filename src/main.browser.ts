import './assets/styles.css';
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

import logoFull from './assets/koyomiji_full_hr.svg?url';
import mailIcon from '@tabler/icons/mail.svg?raw';
import twitterIcon from '@tabler/icons/brand-twitter.svg?raw';
import githubIcon from '@tabler/icons/brand-github.svg?raw';
import youtubeIcon from '@tabler/icons/brand-youtube.svg?raw';
import twitchIcon from '@tabler/icons/brand-twitch.svg?raw';
import calenderIcon from '@tabler/icons/calendar-time.svg?raw';
import tagsIcon from '@tabler/icons/tags.svg?raw';

window.addEventListener('load', async () => {
  loadLogo();
  loadIcons();

  await Promise.all([
    loadHighlight(),
    loadMath()
  ]);
});

function loadLogo() {
  if (document.getElementById('logo') != null) {
    (document.getElementById('logo') as HTMLImageElement).src = logoFull;
  }
}

function setIcon(className:string, svg:string) {
  for (const i of document.getElementsByClassName(className)) {
    i.outerHTML = svg;
  }
}

function loadIcons() {
  setIcon('mail-icon', mailIcon);
  setIcon('twitter-icon', twitterIcon);
  setIcon('github-icon', githubIcon);
  setIcon('youtube-icon', youtubeIcon);
  setIcon('twitch-icon', twitchIcon);
  setIcon('calender-icon', calenderIcon);
  setIcon('tags-icon', tagsIcon);
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

    for(const mathInline of mathInlines){
      katex.render(mathInline.textContent!, mathInline as any);
    }
  }
}