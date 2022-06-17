import './assets/styles.css';
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'
import loadPrism from './loadPrism.js';

window.addEventListener('load', async () => {
  if (document.querySelector('code') != null) {
    const prismjs = await import('prismjs');
    await loadPrism();
    prismjs.highlightAll();
  }

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
});