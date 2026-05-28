"use client";

import { PRESETS } from "@/lib/calculator/presets";
import { Preset } from "@/lib/calculator/types";

interface PresetPickerProps {
  onAdd: (preset: Preset) => void;
}

export default function PresetPicker({ onAdd }: PresetPickerProps) {
  return (
    <div>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 10 }}>
        Quick-add a common task:
      </p>
      <div className="preset-row">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => onAdd(p)}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#c4c9d8",
              borderRadius: 10,
              padding: "9px 14px",
              fontSize: 13.5,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s",
              fontFamily: "inherit",
              minHeight: 38,
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(91,139,255,0.15)";
              e.currentTarget.style.borderColor = "rgba(91,139,255,0.3)";
              e.currentTarget.style.color = "#e8eaf2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
              e.currentTarget.style.color = "#c4c9d8";
            }}
          >
            <span>{p.icon}</span> {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
