import React from "react";
import { FieldEditor, defaultValueForSchema } from "./FieldEditor.jsx";

function createComponent(type, schema, previous = {}) {
  if (!type) return undefined;
  const base = {
    type,
    props: schema ? defaultValueForSchema(schema) || {} : {},
  };
  if (previous._wrapTw) base._wrapTw = previous._wrapTw;
  return base;
}

function ComponentEditor({
  component,
  onChange,
  onRemove,
  components,
  componentOptions,
  label,
}) {
  const current = component && typeof component === "object" ? component : {};
  const type = current.type || "";
  const schema = type ? components[type] : null;
  const propsValue = current.props && typeof current.props === "object" ? current.props : {};
  const wrapTw = current._wrapTw || "";

  return (
    <div style={styles.component}>
      <div style={styles.componentHeader}>
        <label style={{ ...styles.label, flex: 1 }}>
          <span style={styles.labelText}>{label}</span>
          <select
            value={type}
            onChange={(e) => {
              const nextType = e.target.value;
              if (!nextType) {
                if (onRemove) onRemove();
                else onChange(undefined);
                return;
              }
              const nextSchema = components[nextType];
              onChange(createComponent(nextType, nextSchema, current));
            }}
            style={styles.input}
          >
            <option value="">Select component</option>
            {componentOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            style={styles.removeButton}
          >
            Remove
          </button>
        )}
      </div>

      {type && (
        <div style={styles.componentBody}>
          <label style={styles.label}>
            <span style={styles.labelText}>Wrapper classes (_wrapTw)</span>
            <input
              type="text"
              value={wrapTw}
              onChange={(e) => {
                const val = e.target.value;
                const next = { ...current, type, props: propsValue };
                if (val) next._wrapTw = val;
                else delete next._wrapTw;
                onChange(next);
              }}
              style={styles.input}
            />
          </label>
          {schema ? (
            <FieldEditor
              schema={schema}
              value={propsValue}
              onChange={(val) => {
                const next = { ...current, type, props: val ?? {} };
                if (!val) delete next.props;
                onChange(next);
              }}
              path={[type, "props"]}
            />
          ) : (
            <div style={styles.missingSchema}>No schema found for {type}</div>
          )}
        </div>
      )}
    </div>
  );
}

export function SlotEditor({
  slotName,
  value,
  onChange,
  components,
  componentOptions,
}) {
  const header = slotName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (Array.isArray(value)) {
    const arr = value;
    return (
      <div style={styles.slot}>
        <div style={styles.slotHeader}>{header}</div>
        {arr.map((item, idx) => (
          <ComponentEditor
            key={idx}
            component={item}
            onChange={(nextComponent) => {
              if (nextComponent === undefined) {
                const next = arr.filter((_, i) => i !== idx);
                onChange(next.length ? next : []);
              } else {
                const next = [...arr];
                next[idx] = nextComponent;
                onChange(next);
              }
            }}
            onRemove={() => {
              const next = arr.filter((_, i) => i !== idx);
              onChange(next.length ? next : []);
            }}
            components={components}
            componentOptions={componentOptions}
            label={`Item ${idx + 1}`}
          />
        ))}
        <button
          type="button"
          onClick={() => {
            const defaultType = componentOptions[0];
            if (defaultType) {
              onChange([
                ...(arr || []),
                createComponent(defaultType, components[defaultType] || {}),
              ]);
            }
          }}
          style={styles.addButton}
        >
          Add Component
        </button>
      </div>
    );
  }

  return (
    <div style={styles.slot}>
      <div style={styles.slotHeader}>{header}</div>
      <ComponentEditor
        component={value}
        onChange={(nextComponent) => {
          if (nextComponent === undefined) onChange(undefined);
          else onChange(nextComponent);
        }}
        onRemove={() => onChange(undefined)}
        components={components}
        componentOptions={componentOptions}
        label="Component"
      />
    </div>
  );
}

const styles = {
  slot: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.75rem",
    background: "#fff",
  },
  slotHeader: {
    fontSize: "1rem",
    fontWeight: 600,
  },
  component: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  componentHeader: {
    display: "flex",
    gap: "0.75rem",
    alignItems: "flex-end",
  },
  componentBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
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
  removeButton: {
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    border: "1px solid #ef4444",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.75rem",
    height: "2.25rem",
  },
  addButton: {
    alignSelf: "flex-start",
    padding: "0.35rem 0.85rem",
    borderRadius: "9999px",
    border: "1px solid #0ea5e9",
    background: "#0ea5e9",
    color: "#fff",
    cursor: "pointer",
    fontSize: "0.75rem",
  },
  missingSchema: {
    padding: "0.75rem",
    borderRadius: "0.5rem",
    background: "#fef3c7",
    color: "#92400e",
    fontSize: "0.875rem",
  },
};

export { createComponent };
