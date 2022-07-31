import './assets/styles.css';
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

import logoFull from './assets/koyomiji_full_hr.svg?url';

window.addEventListener('load', async () => {
  loadLogo();

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