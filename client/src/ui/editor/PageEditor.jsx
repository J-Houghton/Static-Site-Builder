import React from "react";
import { RegionEditor } from "./RegionEditor.jsx";

export function PageEditor({
  page,
  onChange,
  layout,
  components,
  componentOptions,
}) {
  const regions = page?.regions || {};
  const layoutRegions = layout?.regions || {};
  const title = page?.title || "";

  const updatePage = (next) => {
    onChange({ ...page, ...next });
  };

  const handleRegionChange = (regionName, regionValue) => {
    const nextRegions = { ...regions };
    if (!regionValue || Object.keys(regionValue).length === 0) delete nextRegions[regionName];
    else nextRegions[regionName] = regionValue;
    updatePage({ regions: nextRegions });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Page</div>
      <div style={styles.body}>
        <label style={styles.label}>
          <span style={styles.labelText}>Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => updatePage({ title: e.target.value })}
            style={styles.input}
          />
        </label>
        <div style={styles.regions}>
          {Object.entries(layoutRegions).map(([regionName, definition]) => (
            <RegionEditor
              key={regionName}
              regionName={regionName}
              regionValue={regions[regionName]}
              slots={definition.slots || []}
              onChange={(value) => handleRegionChange(regionName, value)}
              components={components}
              componentOptions={componentOptions}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #e5e7eb",
    borderRadius: "1rem",
    background: "#fff",
    overflow: "hidden",
  },
  header: {
    padding: "0.75rem 1rem",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
    fontWeight: 600,
  },
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    padding: "1.5rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    fontSize: "0.875rem",
    color: "#111827",
  },
  labelText: {
    fontWeight: 500,
  },
  input: {
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
  },
  regions: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
};
