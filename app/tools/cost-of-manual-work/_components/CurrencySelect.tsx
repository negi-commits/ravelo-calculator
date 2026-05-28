"use client";

import { CurrencyCode } from "@/lib/currency";

interface CurrencySelectProps {
  value: CurrencyCode;
  onChange: (c: CurrencyCode) => void;
}

export default function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
      }}
    >
      <label
        style={{
          fontSize: 11.5,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Currency
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CurrencyCode)}
        style={{ width: "auto", minWidth: 86, paddingRight: 30 }}
      >
        <option value="USD">USD</option>
        <option value="INR">INR</option>
        <option value="AED">AED</option>
      </select>
    </div>
  );
}
