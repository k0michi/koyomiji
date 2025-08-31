# Google Geminiのチャットの名称をページタイトルに設定するユーザースクリプト

ChatGPTとClaudeでは、今開いているチャットの名称がページのタイトルに設定されるのですが、Geminiだけはチャットの中身に関わらず"Google Gemini"という味気ないタイトルになってしまうので、沢山開いているとタブを見つけにくいのです……。FirefoxのViolentmonkeyで動作を確認済み。アプデで壊れる可能性は高いですが。

```js
// ==UserScript==
// @name         Gemini Chat Name in Title
// @name:ja      Geminiチャット名をタイトルに表示
// @namespace    https://github.com/k0michi/
// @version      1.0
// @description  Set the current Gemini chat's name as the page title
// @description:ja Geminiで現在開いているチャットの名称をページのタイトルに設定するスクリプト
// @author       k0michi
// @match        https://gemini.google.com/app*
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
  'use strict';

  const DEBOUNCE_MS = 500;
  const OBSERVE_RETRY_MS = 500;
  const SCRIPT_NAME = 'gemini_chat_title';
  const CHAT_TITLE_SELECTOR = 'conversations-list .selected .conversation-title';

  let debounceTimer;
  const defaultTitle = document.title;

  function log(...args) {
    console.log(`[${SCRIPT_NAME}]`, ...args);
  }

  function updateTitle() {
    const titleElement = document.querySelector(CHAT_TITLE_SELECTOR);

    if (titleElement && titleElement.textContent) {
      const chatTitle = titleElement.textContent.trim();
      log(`Active chat found: ${chatTitle}`);
      document.title = `${chatTitle} - ${defaultTitle}`;
    } else {
      log('No active chat found');
      document.title = defaultTitle;
    }
  }

  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateTitle, DEBOUNCE_MS);
  });

  function startObserver() {
    const targetNode = document.body;

    if (targetNode) {
      log('Body element found, starting observer');

      observer.observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: false,
      });

      updateTitle();
    } else {
      log('No body element found, retrying...');
      setTimeout(startObserver, OBSERVE_RETRY_MS);
    }
  }

  startObserver();
})();
```