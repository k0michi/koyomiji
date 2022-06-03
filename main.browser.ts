import katex from 'katex';
import prismjs from 'prismjs';
import './assets/styles.css';
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

window.addEventListener('load', () => {
  const mathElements = document.getElementsByClassName('math-block');

  for (const mathElement of mathElements) {
    katex.render(mathElement.textContent!, mathElement as any, { displayMode: true });
  }
});