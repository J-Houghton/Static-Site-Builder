// Map "Type@Version" -> renderer(props) => HTML
export const renderers = {
  "Text@v1": ({ text = "", as = "p" }) => `<${as} class="c-text">${escapeHtml(text)}</${as}>`,
  "Media@v1": ({ src, alt = "", width, height }) => {
    if (!src) return "";
    const wh = [width ? ` width="${Number(width)}"` : "", height ? ` height="${Number(height)}"` : ""].join("");
    return `<img class="c-media" src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${wh}>`;
  },
  "Nav@v1": ({ items = [] }) => {
    const lis = items.map(i => `<li><a href="${escapeAttr(i.href || "#")}">${escapeHtml(i.label || "")}</a></li>`).join("");
    return `<nav class="c-nav"><ul>${lis}</ul></nav>`;
  },
  "Input@v1": ({ name, type = "text", label = "", placeholder = "" }) => {
    const id = `in_${hash(name || label)}`;
    return `<label for="${id}" class="c-label">${escapeHtml(label)}</label>
<input class="c-input" id="${id}" name="${escapeAttr(name || id)}" type="${escapeAttr(type)}" placeholder="${escapeAttr(placeholder)}">`;
  }
};

const escapeHtml = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const escapeAttr = escapeHtml;
const hash = s => (String(s).split("").reduce((a,c)=>((a<<5)-a+c.charCodeAt(0))|0,0)>>>0).toString(36);
