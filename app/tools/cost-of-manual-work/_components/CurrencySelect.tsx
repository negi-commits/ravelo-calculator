"use client";

import { CurrencyCode } from "@/lib/currency";

interface CurrencySelectProps {
  value: CurrencyCode;
  onChange: (c: CurrencyCode) => void;
}

export default function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <label style={{ fontSize: 12, color: "#6b7280" }}>Currency</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CurrencyCode)}
        style={{ width: "auto", minWidth: 80 }}
      >
        <option value="USD">USD</option>
        <option value="INR">INR</option>
        <option value="AED">AED</option>
      </select>
    </div>
  );
}
