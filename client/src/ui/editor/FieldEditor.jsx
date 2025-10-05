import React, { useState } from "react";

function fieldLabel(path, schema) {
  if (schema?.title) return schema.title;
  const key = path[path.length - 1] || "";
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function defaultValueForSchema(schema) {
  if (!schema) return undefined;
  if (schema.default !== undefined) return schema.default;
  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
  switch (type) {
    case "string":
      return schema.enum?.[0] ?? "";
    case "number":
    case "integer":
      return 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object": {
      const props = schema.properties || {};
      const required = new Set(schema.required || []);
      const entries = Object.entries(props)
        .map(([key, propSchema]) => {
          const childDefault = defaultValueForSchema(propSchema);
          if (childDefault === undefined && !required.has(key)) return null;
          return [key, childDefault];
        })
        .filter(Boolean);
      return Object.fromEntries(entries);
    }
    default:
      return undefined;
  }
}

export function FieldEditor({ schema, value, onChange, path = [], required = false }) {
  if (!schema) return null;
  const label = fieldLabel(path, schema);
  const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
  const fieldId = path.join("-") || schema.$id || label;

  if (schema.enum && type === "string") {
    const val = value ?? "";
    return (
      <label style={styles.label} htmlFor={fieldId}>
        <span style={styles.labelText}>{label}{required ? " *" : ""}</span>
        <select
          id={fieldId}
          value={val}
          onChange={(e) => onChange(e.target.value || (required ? schema.enum[0] : undefined))}
          style={styles.input}
        >
          {!required && <option value="">(none)</option>}
          {schema.enum.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>
    );
  }

  if (type === "string") {
    const val = value ?? "";
    return (
      <label style={styles.label} htmlFor={fieldId}>
        <span style={styles.labelText}>{label}{required ? " *" : ""}</span>
        <input
          id={fieldId}
          type="text"
          value={val}
          onChange={(e) => {
            const next = e.target.value;
            onChange(next === "" && !required ? undefined : next);
          }}
          style={styles.input}
        />
      </label>
    );
  }

  if (type === "number" || type === "integer") {
    const val = value ?? "";
    return (
      <label style={styles.label} htmlFor={fieldId}>
        <span style={styles.labelText}>{label}{required ? " *" : ""}</span>
        <input
          id={fieldId}
          type="number"
          value={val}
          onChange={(e) => {
            const next = e.target.value;
            onChange(next === "" && !required ? undefined : Number(next));
          }}
          style={styles.input}
        />
      </label>
    );
  }

  if (type === "boolean") {
    const val = Boolean(value);
    return (
      <label style={{ ...styles.label, flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          checked={val}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span style={styles.labelText}>{label}</span>
      </label>
    );
  }

  if (type === "array") {
    return (
      <ArrayField
        label={label}
        schema={schema}
        value={value}
        onChange={onChange}
        path={path}
        required={required}
      />
    );
  }

  if (type === "object") {
    return (
      <ObjectField
        label={label}
        schema={schema}
        value={value}
        onChange={onChange}
        path={path}
        required={required}
      />
    );
  }

  return null;
}

function ArrayField({ label, schema, value, onChange, path, required }) {
  const arr = Array.isArray(value) ? value : [];
  const itemsSchema = schema.items || {};
  const [collapsed, setCollapsed] = useState(false);

  const headerStyle = {
    ...styles.sectionHeader,
    justifyContent: "space-between",
  };

  return (
    <div style={styles.arrayField}>
      <div style={headerStyle}>
        <div style={styles.sectionTitle}>
          {label}
          {required ? " *" : ""}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          style={styles.collapseButton}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      {!collapsed && (
        <>
          {arr.map((item, idx) => (
            <div key={idx} style={styles.arrayItem}>
              <FieldEditor
                schema={itemsSchema}
                value={item}
                onChange={(val) => {
                  const next = [...arr];
                  next[idx] = val;
                  onChange(next);
                }}
                path={[...path, String(idx)]}
                required={true}
              />
              <button
                type="button"
                onClick={() => {
                  const next = arr.filter((_, i) => i !== idx);
                  onChange(next.length ? next : (required ? [] : undefined));
                }}
                style={styles.smallButton}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const next = [...arr, defaultValueForSchema(itemsSchema)];
              onChange(next);
            }}
            style={styles.smallButton}
          >
            Add Item
          </button>
        </>
      )}
    </div>
  );
}

function ObjectField({ label, schema, value, onChange, path, required }) {
  const props = schema.properties || {};
  const requiredSet = new Set(schema.required || []);
  const objVal = value && typeof value === "object" ? value : {};
  const [collapsed, setCollapsed] = useState(false);
  const hasHeaderLabel = Boolean(label && (path.length > 0 || schema.title));

  return (
    <div style={styles.objectField}>
      <div
        style={{
          ...styles.sectionHeader,
          justifyContent: hasHeaderLabel ? "space-between" : "flex-end",
        }}
      >
        {hasHeaderLabel && (
          <div style={styles.sectionTitle}>
            {label}
            {required ? " *" : ""}
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          style={styles.collapseButton}
        >
          {collapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      {!collapsed && (
        <div style={styles.objectBody}>
          {Object.entries(props).map(([key, propSchema]) => (
            <FieldEditor
              key={key}
              schema={propSchema}
              value={objVal[key]}
              onChange={(val) => {
                const next = { ...objVal };
                if (val === undefined) {
                  delete next[key];
                } else {
                  next[key] = val;
                }
                onChange(Object.keys(next).length ? next : (required ? {} : undefined));
              }}
              path={[...path, key]}
              required={requiredSet.has(key)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
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
  arrayField: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    padding: "0.75rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.75rem",
    background: "#f9fafb",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  sectionTitle: {
    fontWeight: 600,
    fontSize: "0.875rem",
  },
  arrayItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    background: "#fff",
    padding: "0.75rem",
    borderRadius: "0.75rem",
    border: "1px solid #e5e7eb",
  },
  smallButton: {
    alignSelf: "flex-start",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    border: "1px solid #0ea5e9",
    background: "#0ea5e9",
    color: "#fff",
    fontSize: "0.75rem",
    cursor: "pointer",
  },
  collapseButton: {
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111827",
    cursor: "pointer",
    fontSize: "0.75rem",
  },
  objectField: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    padding: "0.75rem",
    border: "1px solid #e5e7eb",
    borderRadius: "0.75rem",
    background: "#f9fafb",
  },
  objectBody: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
};

export { defaultValueForSchema };
