import React, { useEffect, useMemo, useRef, useState } from "react";
import { renderDoc } from "../core/ssbPreview.js";

const starter = {
  "title": "MVP Home",
  "regions": {
    "header": {
      "nav": { "type": "Nav@v1", "props": {
        "items": [
          { "label": "Home", "href": "#" },
          { "label": "Docs", "href": "#" },
          { "label": "Contact", "href": "#" }
        ],
        "tw": "text-sm"
      } }
    },
    "main": {
      "_tw": "grid grid-cols-12 gap-8",
      "hero":   { "type": "Text@v1", "props": { "as":"h1", "text":"Static Site Builder MVP", "tw":"col-span-12 md:col-span-8 text-3xl font-bold" } },
      "content": [
        { "type": "Text@v1", "props": { "text":"This page was generated from a JSON contract.", "tw":"col-span-12 md:col-span-8" } },
        { "type": "Media@v1", "props": { "src":"https://picsum.photos/600/400", "alt":"Hero", "tw":"col-span-12 md:col-span-4 rounded-lg" } },
        { "type": "Input@v1", "props": { "name":"email", "type":"email", "label":"Join updates", "placeholder":"you@example.com", "tw":"col-span-12 md:col-span-6" } }
      ]
    },
    "footer": {
      "cta":   { "type": "Text@v1", "props": { "as":"h3", "text":"Ready to ship.", "tw":"text-lg font-semibold" } },
      "legal": { "type": "Text@v1", "props": { "as":"small", "text":"© 2025 SSB.", "tw":"text-gray-500" } }
    }
  }
};

export default function App(){
  const [text, setText] = useState(() => JSON.stringify(starter, null, 2));
  const [error, setError] = useState("");
  const iframeRef = useRef(null);

  const docHtml = useMemo(() => {
    try {
      const cfg = JSON.parse(text);
      setError("");
      return renderDoc(cfg);
    } catch {
      setError("Invalid JSON");
      return renderDoc(starter);
    }
  }, [text]);

  useEffect(() => {
    const blob = new Blob([docHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const el = iframeRef.current;
    el.src = url;
    return () => URL.revokeObjectURL(url);
  }, [docHtml]);

  const onLoadFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const t = await f.text();
    setText(t);
  };

  const onDownload = () => {
    try{
      const cfg = JSON.parse(text);
      const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = (cfg.title?.toLowerCase().replace(/\s+/g,"-") || "page") + ".json";
      a.click();
    } catch {
      // ignore, editor already shows error
    }
  };

  return (
    <div style={{fontFamily:"ui-sans-serif, system-ui"}}>
      <header style={{borderBottom:"1px solid #e5e7eb"}}>
        <div style={{maxWidth: "72rem", margin: "0 auto", padding: "1rem", display:"flex", gap:"0.75rem", alignItems:"center"}}>
          <h1 style={{fontSize:"1.125rem", fontWeight:600}}>SSB React Client</h1>
          <input type="file" accept="application/json" onChange={onLoadFile} />
          <button onClick={onDownload} style={btn()}>Download JSON</button>
          <button onClick={()=>setText(JSON.stringify(starter, null, 2))} style={btn(true)}>New</button>
          <span style={{marginLeft:"auto", color:"#6b7280", fontSize:14}}>{error}</span>
        </div>
      </header>

      <main style={{maxWidth:"72rem", margin:"0 auto", padding:"1rem"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem"}}>
          <section style={panel()}>
            <div style={panelHead()}>Config</div>
            <textarea
              value={text}
              onChange={e=>setText(e.target.value)}
              spellCheck={false}
              style={{width:"100%", height:"65vh", padding:"0.75rem", fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas", fontSize:12, outline:"none", border:"none"}}
            />
          </section>
          <section style={panel()}>
            <div style={panelHead()}>Preview</div>
            <iframe ref={iframeRef} style={{width:"100%", height:"65vh", background:"#fff", border:"0"}} title="preview" />
          </section>
        </div>
      </main>
    </div>
  );
}

function btn(primary=false){
  return {
    padding:"0.25rem 0.75rem",
    borderRadius:8,
    border: primary ? "1px solid #0ea5e9" : "1px solid #e5e7eb",
    background: primary ? "#0ea5e9" : "transparent",
    color: primary ? "#fff" : "#111",
    cursor:"pointer"
  };
}
function panel(){ return { border:"1px solid #e5e7eb", borderRadius:12, overflow:"hidden", background:"#fff" }; }
function panelHead(){ return { padding:"0.75rem", borderBottom:"1px solid #e5e7eb", background:"#f9fafb", fontWeight:600 }; }
