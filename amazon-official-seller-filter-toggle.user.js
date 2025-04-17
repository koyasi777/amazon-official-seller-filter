// ==UserScript==
// @name         Amazon公式セラー絞り込みトグル 🔄（p_6:AN1VRQENFRJN5対応）
// @namespace    https://github.com/koyasi777/amazon-seller-filter-toggle
// @version      14.1
// @description  Amazon検索結果に「Amazon公式セラー（p_6:AN1VRQENFRJN5）」の絞り込みトグルを追加！SPA対応・レイアウト崩れ対策・高速安定版。
// @author       koyasi777
// @match        https://www.amazon.co.jp/s*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/koyasi777/amazon-seller-filter-toggle
// @supportURL   https://github.com/koyasi777/amazon-seller-filter-toggle/issues
// ==/UserScript==

(() => {
  'use strict';

  const CONST = {
    P6_KEY: 'p_6:AN1VRQENFRJN5',
    STORAGE_KEY: 'p6_filter_enabled',
    WRAPPER_ID: 'p6-switch-wrapper',
    STYLE_ID: 'p6-style',
    TEMPLATE_ID: 'p6-template'
  };

  const log = (...args) => console.debug('[p6-toggle]', ...args);
  const State = {
    get: () => localStorage.getItem(CONST.STORAGE_KEY) === 'true',
    set: (val) => localStorage.setItem(CONST.STORAGE_KEY, val ? 'true' : 'false'),
  };

  const isP6InURL = () => new URLSearchParams(location.search).get('rh')?.includes(CONST.P6_KEY);
  const getKeyword = () => document.querySelector('input[name="field-keywords"]')?.value.trim() || '';

  const navigateToSearch = (keyword, includeP6) => {
    const params = new URLSearchParams(location.search);
    params.delete('rh');
    if (includeP6) params.set('rh', CONST.P6_KEY);
    if (keyword) params.set('k', keyword);
    params.set('timestamp', Date.now());
    const newURL = `/s?${params.toString()}`;
    if (location.pathname + location.search !== newURL) location.assign(newURL);
  };

  const insertStyle = () => {
    if (document.getElementById(CONST.STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = CONST.STYLE_ID;
    style.textContent = `
      #${CONST.WRAPPER_ID} {
        display: flex;
        align-items: center;
        margin-left: 10px;
        gap: 8px;
        font-size: 13px;
        user-select: none;
        color: white;
        z-index: 9999;
      }
      .p6-label { font-weight: bold; }
      .p6-switch {
        position: relative;
        display: inline-block;
        width: 36px;
        height: 20px;
      }
      .p6-switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .p6-slider {
        position: absolute;
        cursor: pointer;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: #666;
        transition: .3s;
        border-radius: 34px;
      }
      .p6-circle {
        position: absolute;
        height: 14px;
        width: 14px;
        left: 4px;
        bottom: 3px;
        background-color: white;
        transition: .3s;
        border-radius: 50%;
      }
      input:checked + .p6-slider { background-color: #4CAF50; }
      input:checked + .p6-slider .p6-circle { left: 18px; }
    `;
    document.head.appendChild(style);
  };

  const insertTemplate = () => {
    if (document.getElementById(CONST.TEMPLATE_ID)) return;
    const tpl = document.createElement('template');
    tpl.id = CONST.TEMPLATE_ID;
    tpl.innerHTML = `
      <div id="${CONST.WRAPPER_ID}">
        <label class="p6-switch">
          <input type="checkbox">
          <span class="p6-slider"><span class="p6-circle"></span></span>
        </label>
        <span class="p6-label"></span>
      </div>
    `;
    document.body.appendChild(tpl);
  };

  const createToggleUI = (enabled) => {
    const wrapper = document.getElementById(CONST.TEMPLATE_ID).content.firstElementChild.cloneNode(true);
    const checkbox = wrapper.querySelector('input');
    const label = wrapper.querySelector('.p6-label');

    const updateLabel = (on) => {
      label.textContent = `セラー絞り込み: ${on ? '有効中' : '無効'}`;
      label.style.color = on ? '#90ee90' : '#eee';
    };

    checkbox.checked = enabled;
    updateLabel(enabled);
    checkbox.addEventListener('change', () => {
      const newState = checkbox.checked;
      State.set(newState);
      updateLabel(newState);
      navigateToSearch(getKeyword(), newState);
    });

    return wrapper;
  };

  const mount = () => {
    try {
      const form = document.querySelector('#nav-search-bar-form');
      const target = form?.querySelector('.nav-search-submit');
      if (!form || !target || document.getElementById(CONST.WRAPPER_ID)) return;

      insertStyle();
      insertTemplate();

      const stateInURL = isP6InURL();
      if (State.get() !== stateInURL) State.set(stateInURL);

      const toggle = createToggleUI(stateInURL);
      target.parentNode.insertBefore(toggle, target.nextSibling);

      const input = form.querySelector('input[name="field-keywords"]');
      const submit = form.querySelector('.nav-search-submit input[type="submit"]');

      const trigger = () => navigateToSearch(input.value.trim(), State.get());
      form.addEventListener('submit', (e) => (e.preventDefault(), trigger()));
      submit.addEventListener('click', (e) => (e.preventDefault(), trigger()));
      input.addEventListener('keydown', (e) => e.key === 'Enter' && (e.preventDefault(), trigger()));
    } catch (e) {
      log('mount failed:', e);
    }
  };

  const observeSuggestions = () => {
    const hooked = new WeakSet();
    const observer = new MutationObserver(() => {
      document.querySelectorAll('.s-suggestion[role="button"]').forEach((el) => {
        if (hooked.has(el)) return;
        hooked.add(el);
        el.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const keyword = el.getAttribute('aria-label') || el.textContent.trim();
          if (keyword) navigateToSearch(keyword, State.get());
        }, { once: true });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  const hookSPARouting = () => {
    const origPushState = history.pushState;
    history.pushState = function (...args) {
      const r = origPushState.apply(this, args);
      queueMicrotask(() => mount());
      return r;
    };
    window.addEventListener('popstate', () => queueMicrotask(() => mount()));
  };

  const disableNavActive = () => {
    const form = document.querySelector('#nav-search-bar-form');
    if (!form) return;
    const observer = new MutationObserver(() => {
      if (form.classList.contains('nav-active')) {
        form.classList.remove('nav-active');
        log('Removed nav-active to prevent layout shift');
      }
    });
    observer.observe(form, { attributes: true, attributeFilter: ['class'] });
  };

  requestIdleCallback(() => {
    mount();
    observeSuggestions();
    hookSPARouting();
    disableNavActive();
  });
})();
