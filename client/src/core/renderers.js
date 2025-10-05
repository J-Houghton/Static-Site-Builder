const escapeHtml = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const escapeAttr = escapeHtml;
const cls = (...xs) => xs.filter(Boolean).join(" ");
const hash = s => (String(s).split("").reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,0)>>>0).toString(36);

export const renderers = {
  "Text@v1": ({ text = "", as = "p", tw = "", class:klass = "" }) =>
    `<${as} class="${cls("c-text", tw, klass)}">${escapeHtml(text)}</${as}>`,

  "Media@v1": ({ src, alt = "", width, height, tw = "", class:klass = "" }) => {
    if (!src) return "";
    const wh = [width ? ` width="${Number(width)}"` : "", height ? ` height="${Number(height)}"` : ""].join("");
    return `<img class="${cls("c-media", tw, klass)}" src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${wh}>`;
  },

  "Nav@v1": ({ items = [], tw = "", class:klass = "" }) => {
    const lis = items.map(i =>
      `<li><a class="px-2 py-1 rounded hover:bg-gray-100" href="${escapeAttr(i.href || "#")}">${escapeHtml(i.label || "")}</a></li>`
    ).join("");
    return `<nav class="${cls("c-nav", tw, klass)}"><ul class="flex gap-4 flex-wrap">${lis}</ul></nav>`;
  },

  "Input@v1": ({ name, type = "text", label = "", placeholder = "", tw = "", class:klass = "" }) => {
    const id = `in_${hash(name || label)}`;
    return `<label for="${id}" class="${cls("c-label")}">${escapeHtml(label)}</label>
<input class="${cls("c-input", tw, klass)}" id="${id}" name="${escapeAttr(name || id)}" type="${escapeAttr(type)}" placeholder="${escapeAttr(placeholder)}">`;
  }
};
