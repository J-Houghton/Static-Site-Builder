import { renderers } from "./renderers.js";

const escapeHtml = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const escapeAttr = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

export function renderDoc(config) {
  const { title = "Preview", regions = {} } = config || {};
  const headerHtml = renderRegion(regions.header);
  const mainHtml   = renderRegion(regions.main, true);
  const footerHtml = renderRegion(regions.footer);

  const baseCSS = `
    :root{
      --bg:#ffffff; --fg:#111111; --muted:#6b7280; --brand:#0ea5e9;
      --space-1:.25rem; --space-2:.5rem; --space-3:.75rem; --space-4:1rem; --space-6:1.5rem; --space-8:2rem;
      --radius-1:.25rem; --radius-2:.5rem; --radius-3:1rem;
      --font: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
    }
    body{margin:0; font-family:var(--font); color:var(--fg); background:var(--bg); line-height:1.5}
    header,main,footer{max-width:72rem; margin:0 auto; padding:var(--space-8) var(--space-4)}
    .c-text{max-width:65ch}
    .c-media{display:block; max-width:100%; height:auto; border-radius:var(--radius-2)}
    .c-label{display:block; font-size:.875rem; color:var(--muted); margin-bottom:var(--space-1)}
    .c-input{display:block; width:100%; padding:var(--space-3) var(--space-4); border:1px solid #e5e7eb; border-radius:var(--radius-2)}
  `;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>${baseCSS}</style>
</head>
<body>
<header>${headerHtml}</header>
<main>${mainHtml}</main>
<footer>${footerHtml}</footer>
</body>
</html>`;
}

function renderRegion(def = {}, defaultGrid=false){
  const { _tw = "", ...slots } = def || {};
  const child = Object.keys(slots).map(k => renderSlot(slots[k])).join("\n");
  if (_tw) return `<div class="${escapeAttr(_tw)}">${child}</div>`;
  return defaultGrid ? `<div class="grid grid-cols-12 gap-8">${child}</div>` : child;
}

function renderSlot(slotDef){
  if (Array.isArray(slotDef)) return slotDef.map(renderSlot).join("");
  if (!slotDef || typeof slotDef !== "object") return "";
  const { type, props = {} } = slotDef;
  const fn = renderers[type];
  return fn ? fn(props) : `<!-- missing renderer ${type || ""} -->`;
}
