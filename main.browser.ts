import katex from 'katex';
import renderMathInElement from 'katex/contrib/auto-render';
import prismjs from 'prismjs';
import './assets/styles.css';
import 'prismjs/themes/prism-tomorrow.css'
import 'katex/dist/katex.min.css'

window.addEventListener('load', () => {
  renderMathInElement(document.body);
});