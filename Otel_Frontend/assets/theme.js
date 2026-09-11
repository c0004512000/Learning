(() => {
  const script = document.currentScript;
  if (script?.src && !document.querySelector('link[data-mobile-learning-style]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = new URL('mobile.css', script.src).href;
    link.dataset.mobileLearningStyle = 'true';
    document.head.appendChild(link);
  }

  const key = "learning-theme";
  const root = document.documentElement;
  const saved = localStorage.getItem(key);
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;

  function effectiveTheme() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function label(button) {
    button.textContent = effectiveTheme() === "dark" ? "☀︎ 淺色" : "☾ 深色";
    button.setAttribute("aria-label", "切換深淺色模式");
  }

  document.addEventListener("DOMContentLoaded", () => {
    let button = document.querySelector(".theme-toggle");
    if (!button) {
      button = document.createElement("button");
      button.className = "theme-toggle no-print";
      document.body.prepend(button);
    }
    label(button);
    button.addEventListener("click", () => {
      const next = effectiveTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem(key, next);
      label(button);
    });
  });
})();
