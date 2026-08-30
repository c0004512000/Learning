/* Shared theme toggle for every lesson.
   Include this script in a lesson's <head> after style.css. */
(function () {
  'use strict';

  const storageKey = 'otel-teaching-theme';
  const root = document.documentElement;
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getStoredTheme() {
    try {
      const theme = window.localStorage.getItem(storageKey);
      return theme === 'light' || theme === 'dark' ? theme : null;
    } catch (error) {
      console.warn('Unable to read the saved lesson theme.', error);
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.warn('Unable to save the lesson theme.', error);
    }
  }

  function resolvedTheme() {
    return root.dataset.theme || (mediaQuery.matches ? 'dark' : 'light');
  }

  function updateToggle(toggle) {
    const isDark = resolvedTheme() === 'dark';
    toggle.textContent = isDark ? '☀ 切換為淺色模式' : '☾ 切換為深色模式';
    toggle.setAttribute('aria-label', toggle.textContent);
    toggle.setAttribute('aria-pressed', String(isDark));
  }

  function createToggle() {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'theme-toggle no-print';
    toggle.addEventListener('click', () => {
      const nextTheme = resolvedTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = nextTheme;
      saveTheme(nextTheme);
      updateToggle(toggle);
    });

    document.body.append(toggle);
    updateToggle(toggle);

    mediaQuery.addEventListener('change', () => {
      if (!root.dataset.theme) updateToggle(toggle);
    });
  }

  const savedTheme = getStoredTheme();
  if (savedTheme) root.dataset.theme = savedTheme;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createToggle, { once: true });
  } else {
    createToggle();
  }
})();
