import './assets/styles.css';
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

import logoHr from './assets/koyomiji_hr.svg?url';
import logoVt from './assets/koyomiji.svg?url';

window.addEventListener('load', async () => {
  loadLogo();

  await Promise.all([
    loadHighlight(),
    loadMath()
  ]);
});

function loadLogo() {
  (document.getElementById('logo-hr') as HTMLImageElement).src = logoHr;
  (document.getElementById('logo-vt') as HTMLImageElement).src = logoVt;
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