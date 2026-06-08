// ─────────────────────────────────────────
// Global Reset — full-width layout, no browser default margins
// ─────────────────────────────────────────
export function injectGlobalStyles() {
  if (document.head.querySelector("#kaiflicks-reset")) return;

  const style = document.createElement("style");
  style.id = "kaiflicks-reset";
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 100%; }
    #root { width: 100%; }
  `;
  document.head.appendChild(style);
}
