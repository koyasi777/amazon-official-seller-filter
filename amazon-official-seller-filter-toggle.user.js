// ==UserScript==
// @name         Amazon公式セラー絞り込みトグル 🔄
// @name:ja      Amazon公式セラー絞り込みトグル 🔄
// @name:en      Amazon Official Seller Filter Toggle 🔄
// @name:zh-CN   Amazon官方卖家筛选切换器 🔄
// @name:zh-TW   Amazon官方賣家篩選切換器 🔄
// @name:ko      아마존 공식 셀러 필터 토글 🔄
// @name:fr      Filtre Amazon Vendeur Officiel 🔄
// @name:es      Filtro de Vendedor Oficial de Amazon 🔄
// @name:de      Amazon Offizieller Verkäufer-Filter 🔄
// @name:pt-BR   Alternador de Filtro do Vendedor Oficial da Amazon 🔄
// @name:ru      Переключатель фильтра официального продавца Amazon 🔄
// @version      14.6
// @description         Amazon検索結果に「Amazon公式セラー（p_6:AN1VRQENFRJN5）」の絞り込みトグルを追加！SPA対応・レイアウト崩れ対策・高速安定版。
// @description:en      Adds a toggle in Amazon search results to filter for the official Amazon seller (p_6:AN1VRQENFRJN5). Supports SPA, layout fixes, and fast stable performance.
// @description:zh-CN   在Amazon搜索结果中添加“官方卖家”筛选按钮（p_6:AN1VRQENFRJN5）。支持SPA、布局修复、快速稳定运行。
// @description:zh-TW   在Amazon搜尋結果中加入「官方賣家」篩選切換（p_6:AN1VRQENFRJN5）。支援SPA與版面修正，快速穩定。
// @description:ko      아마존 검색 결과에 공식 셀러(p_6:AN1VRQENFRJN5) 필터 토글 추가. SPA 대응, 레이아웃 문제 해결, 빠르고 안정적입니다.
// @description:fr      Ajoute un filtre pour le vendeur officiel Amazon dans les résultats de recherche. Compatible SPA, rapide et fiable.
// @description:es      Añade un filtro para el vendedor oficial de Amazon en los resultados de búsqueda. Compatible con SPA, estable y rápido.
// @description:de      Fügt in den Amazon-Suchergebnissen einen Filter für den offiziellen Verkäufer hinzu. Unterstützt SPA, schnelle und stabile Ausführung.
// @description:pt-BR   Adiciona um botão para filtrar pelo vendedor oficial da Amazon nos resultados de busca. Suporte a SPA, layout estável e rápido.
// @description:ru      Добавляет переключатель фильтра официального продавца Amazon в результатах поиска. Поддерживает SPA, исправления макета, быструю и стабильную работу.
// @namespace    https://github.com/koyasi777/amazon-official-seller-filter
// @author       koyasi777
// @match        https://www.amazon.co.jp/s*
// @match        https://www.amazon.com/s*
// @match        https://www.amazon.co.uk/s*
// @match        https://www.amazon.de/s*
// @match        https://www.amazon.fr/s*
// @match        https://www.amazon.it/s*
// @match        https://www.amazon.es/s*
// @match        https://www.amazon.ca/s*
// @match        https://www.amazon.com.mx/s*
// @match        https://www.amazon.com.br/s*
// @match        https://www.amazon.in/s*
// @match        https://www.amazon.com.au/s*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/koyasi777/amazon-official-seller-filter
// @supportURL   https://github.com/koyasi777/amazon-official-seller-filter/issues
// @icon         https://www.amazon.co.jp/favicon.ico
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
        position: relative;        /* 有効な z-index にする */
        z-index: 2147483647;       /* 先頭に出す */
        isolation: isolate;        /* 擬似要素等の干渉を遮断 */
        pointer-events: auto;      /* 透明レイヤにイベントを奪われにくくする */
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
        <span class="p6-label">公式セラー:</span>
        <label class="p6-switch">
          <input type="checkbox">
          <span class="p6-slider"><span class="p6-circle"></span></span>
        </label>
      </div>
    `;
    document.body.appendChild(tpl);
  };

  const createToggleUI = (enabled) => {
    const wrapper = document.getElementById(CONST.TEMPLATE_ID).content.firstElementChild.cloneNode(true);
    const checkbox = wrapper.querySelector('input');

    checkbox.checked = enabled;
    checkbox.addEventListener('change', () => {
      const newState = checkbox.checked;
      State.set(newState);
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

      // --- ロード完了までポータル配置して重なり回避 ---
      if (document.readyState !== 'complete') ensurePortal();
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

  // ===== ポータル配置（読み込み完了までだけ有効） =====
  let portalMode = false;
  const ensurePortal = () => {
    const el = document.getElementById(CONST.WRAPPER_ID);
    if (!el) return;
    const form = document.querySelector('#nav-search-bar-form');
    const submit = form?.querySelector('.nav-search-submit');
    const r = submit?.getBoundingClientRect();
    if (!r) return;

    if (!portalMode) {
      portalMode = true;
      document.body.appendChild(el);
      Object.assign(el.style, {
        position: 'fixed',
        top: `${Math.round(r.top + r.height / 2)}px`,
        left: `${Math.round(r.right + 8)}px`,
        transform: 'translateY(-50%)',
        zIndex: '2147483647'
      });
      window.addEventListener('resize', ensurePortal);
      window.addEventListener('scroll', ensurePortal, { passive: true });
    } else {
      // 位置の追従だけ更新
      el.style.top = `${Math.round(r.top + r.height / 2)}px`;
      el.style.left = `${Math.round(r.right + 8)}px`;
    }
  };

  const exitPortal = () => {
    if (!portalMode) return;
    portalMode = false;
    const el = document.getElementById(CONST.WRAPPER_ID);
    if (!el) return;
    el.style.position = '';
    el.style.top = '';
    el.style.left = '';
    el.style.transform = '';
    // 本来の場所へ戻す
    const form = document.querySelector('#nav-search-bar-form');
    const target = form?.querySelector('.nav-search-submit');
    target?.parentNode?.insertBefore(el, target.nextSibling);
    window.removeEventListener('resize', ensurePortal);
    window.removeEventListener('scroll', ensurePortal);
  };
  // ================================================

  // ---- ここから初期化順序を前倒し（requestIdleCallback は廃止）----
  const init = () => {
    insertStyle();
    disableNavActive();
    mount();
    observeSuggestions();
    hookSPARouting();

    if (document.readyState === 'complete') {
      exitPortal();
    } else {
      window.addEventListener('load', () => {
        exitPortal();
      }, { once: true });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
  // -----------------------------------------------------------------
})();
