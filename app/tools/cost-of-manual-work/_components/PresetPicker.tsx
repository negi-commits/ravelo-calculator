"use client";

import { PRESETS } from "@/lib/calculator/presets";
import { Preset } from "@/lib/calculator/types";

interface PresetPickerProps {
  onAdd: (preset: Preset) => void;
}

export default function PresetPicker({ onAdd }: PresetPickerProps) {
  return (
    <div>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
        Quick-add a common task:
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => onAdd(p)}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "#c4c9d8",
              borderRadius: 8, padding: "7px 14px", fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.15s", fontFamily: "inherit",
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
