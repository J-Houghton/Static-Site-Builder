import React from "react";
import { SlotEditor } from "./SlotEditor.jsx";

export function RegionEditor({
  regionName,
  regionValue,
  slots = [],
  onChange,
  components,
  componentOptions,
}) {
  const value = regionValue && typeof regionValue === "object" ? regionValue : {};
  const regionTitle = regionName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const tw = value._tw || "";

  const handleSlotChange = (slotName, slotValue) => {
    const next = { ...value };
    if (slotValue === undefined) delete next[slotName];
    else next[slotName] = slotValue;
    onChange(next);
  };

  return (
    <section style={styles.region}>
      <header style={styles.regionHeader}>
        <h3 style={styles.regionTitle}>{regionTitle}</h3>
      </header>
      <div style={styles.regionBody}>
        <label style={styles.label}>
          <span style={styles.labelText}>Region classes (_tw)</span>
          <input
            type="text"
            value={tw}
            onChange={(e) => {
              const val = e.target.value;
              const next = { ...value };
              if (val) next._tw = val;
              else delete next._tw;
              onChange(next);
            }}
            style={styles.input}
          />
        </label>
        <div style={styles.slots}>
          {slots.map((slot) => (
            <SlotEditor
              key={slot}
              slotName={slot}
              value={value[slot]}
              onChange={(slotValue) => handleSlotChange(slot, slotValue)}
              components={components}
              componentOptions={componentOptions}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const styles = {
  region: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid #e5e7eb",
    borderRadius: "1rem",
    overflow: "hidden",
    background: "#fff",
  },
  regionHeader: {
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  regionTitle: {
    margin: 0,
    fontSize: "1.125rem",
  },
  regionBody: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    padding: "1rem",
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
  slots: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
};
