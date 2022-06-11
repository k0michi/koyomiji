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

  const mathElements = document.getElementsByClassName('math-block');

  if (mathElements.length > 0) {
    const katex = (await import('katex')).default;

    for (const mathElement of mathElements) {
      katex.render(mathElement.textContent!, mathElement as any, { displayMode: true });
    }
  }
});