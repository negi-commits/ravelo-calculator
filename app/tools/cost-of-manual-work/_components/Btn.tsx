"use client";

import React from "react";

type Variant = "primary" | "ghost" | "danger" | "teal";

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: "button" | "submit";
}

const VARIANTS: Record<Variant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #5b8bff, #818cf8)",
    color: "#fff",
    boxShadow: "0 4px 20px rgba(91,139,255,0.35)",
    border: "none",
  },
  ghost: {
    background: "rgba(255,255,255,0.06)",
    color: "#94a3b8",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  danger: {
    background: "rgba(239,68,68,0.12)",
    color: "#f87171",
    border: "1px solid rgba(239,68,68,0.2)",
  },
  teal: {
    background: "linear-gradient(135deg, #22d3a5, #0ea5e9)",
    color: "#06060e",
    fontWeight: 700,
    boxShadow: "0 4px 20px rgba(34,211,165,0.35)",
    border: "none",
  },
};

export default function Btn({
  children,
  onClick,
  variant = "primary",
  style = {},
  disabled,
  type = "button",
}: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius: 10,
        fontFamily: "inherit",
        fontWeight: 600,
        fontSize: 14,
        transition: "all 0.2s",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: "10px 20px",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        opacity: disabled ? 0.5 : 1,
        ...VARIANTS[variant],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}
