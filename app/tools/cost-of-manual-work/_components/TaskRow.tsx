"use client";

import { Task } from "@/lib/calculator/types";
import { AUTO_META } from "@/lib/calculator/automatability";
import { CURRENCIES, CurrencyCode } from "@/lib/currency";

interface TaskRowProps {
  task: Task;
  currency: CurrencyCode;
  onChange: (updated: Task) => void;
  onRemove: () => void;
  index: number;
}

export default function TaskRow({ task, currency, onChange, onRemove, index }: TaskRowProps) {
  const badge = AUTO_META[task.automatability];

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "clamp(14px, 3.5vw, 20px)",
        animation: `fadeUp 0.4s ${index * 0.05}s both`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
          gap: 10,
        }}
      >
        <input
          value={task.name}
          onChange={(e) => onChange({ ...task, name: e.target.value })}
          placeholder="Task name"
          style={{
            flex: 1, minWidth: 0,
            fontFamily: "'Instrument Serif', serif", fontWeight: 400,
            fontSize: 20, letterSpacing: "-0.01em",
            background: "transparent", border: "none",
            padding: "6px 0",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 0, minHeight: 0,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span
            style={{
              fontSize: 11, fontWeight: 600,
              padding: "3px 8px", borderRadius: 20,
              background: `${badge.color}1a`, color: badge.color,
              border: `1px solid ${badge.color}33`, whiteSpace: "nowrap",
            }}
          >
            {badge.label}
          </span>
          <button
            onClick={onRemove}
            aria-label="Remove task"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.15)",
              color: "#f87171", borderRadius: 8,
              width: 32, height: 32, cursor: "pointer",
              fontSize: 18, display: "flex",
              alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      </div>

      <div className="task-grid">
        {[
          { label: "People", key: "people" as keyof Task, min: 1 },
          { label: "Minutes / task", key: "minutesPerTask" as keyof Task, min: 1 },
          { label: "Times / period", key: "instancesPerPeriod" as keyof Task, min: 1 },
          { label: `Hourly (${CURRENCIES[currency].symbol})`, key: "hourlyCost" as keyof Task, min: 1 },
        ].map(({ label, key, min }) => (
          <div key={key} style={{ minWidth: 0 }}>
            <label
              style={{
                fontSize: 11, color: "#6b7280",
                display: "block", marginBottom: 5,
                textTransform: "uppercase", letterSpacing: 0.5,
              }}
            >
              {label}
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={min}
              value={task[key] as number}
              onChange={(e) => onChange({ ...task, [key]: Math.max(min, Number(e.target.value)) })}
            />
          </div>
        ))}

        <div style={{ minWidth: 0 }}>
          <label
            style={{
              fontSize: 11, color: "#6b7280",
              display: "block", marginBottom: 5,
              textTransform: "uppercase", letterSpacing: 0.5,
            }}
          >
            Frequency
          </label>
          <select
            value={task.frequency}
            onChange={(e) => onChange({ ...task, frequency: e.target.value as Task["frequency"] })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div style={{ minWidth: 0 }}>
          <label
            style={{
              fontSize: 11, color: "#6b7280",
              display: "block", marginBottom: 5,
              textTransform: "uppercase", letterSpacing: 0.5,
            }}
          >
            Automation
          </label>
          <select
            value={task.automatability}
            onChange={(e) => onChange({ ...task, automatability: e.target.value as Task["automatability"] })}
            style={{ borderColor: `${badge.color}44` }}
          >
            <option value="full">Fully Automatable</option>
            <option value="partial">Partially Automatable</option>
            <option value="unlikely">Hard to Automate</option>
          </select>
        </div>
      </div>
    </div>
  );
}
