"use client";

import { useRef } from "react";
import { CalcResult } from "@/lib/calculator/types";
import { CurrencyCode, formatMoney } from "@/lib/currency";
import Btn from "./Btn";

interface ShareCardProps {
  result: CalcResult;
  currency: CurrencyCode;
  onClose: () => void;
}

export default function ShareCard({ result, currency, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  async function handleDownload() {
    if (!cardRef.current) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const a = document.createElement("a");
      a.download = "ravelo-cost-calculator.png";
      a.href = dataUrl;
      a.click();
    } catch {
      alert("Download failed. Try right-clicking the card and saving as image.");
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(6,6,14,0.85)",
        backdropFilter: "blur(12px)", display: "flex", alignItems: "center",
        justifyContent: "center", zIndex: 100, padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ maxWidth: 480, width: "100%", animation: "fadeUp 0.4s ease both" }}>
        {/* The card */}
        <div
          ref={cardRef}
          style={{
            background: "linear-gradient(135deg,#0d0d1f 0%,#0a0a1a 100%)",
            border: "1px solid rgba(91,139,255,0.3)",
            borderRadius: 24, padding: 36, position: "relative", overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute", top: -80, right: -80, width: 240, height: 240,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(91,139,255,0.2),transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute", bottom: -60, left: -60, width: 180, height: 180,
              borderRadius: "50%",
              background: "radial-gradient(circle,rgba(34,211,165,0.15),transparent 70%)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <span style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#818cf8", letterSpacing: 2, textTransform: "uppercase" }}>
                Ravelo
              </span>
              <span style={{ fontSize: 12, color: "#6b7280" }}>Cost of Manual Work</span>
            </div>

            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8 }}>My team loses</p>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(32px,7vw,52px)",
                fontWeight: 800,
                background: "linear-gradient(90deg,#f87171,#fb923c)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                marginBottom: 8,
              }}
            >
              {formatMoney(result.totalYearlyCost, currency)}
            </div>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 28 }}>
              to manual work every year
            </p>

            <div style={{ display: "flex", gap: 24, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20, flexWrap: "wrap" }}>
              {[
                { label: "Hours / year", val: `${Math.round(result.totalYearlyHours).toLocaleString()} hrs` },
                { label: "Tasks",        val: result.tasks.length },
                { label: "Saveable",     val: formatMoney(result.totalYearlyCost * 0.7, currency) },
              ].map(({ label, val }) => (
                <div key={label}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#e8eaf2", fontSize: 18 }}>{val}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, fontSize: 11, color: "#6b7280" }}>
              Calculated with ravelo.com
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "center" }}>
          <Btn variant="teal" onClick={handleDownload}>⬇ Download PNG</Btn>
          <Btn variant="ghost" onClick={onClose}>Close</Btn>
        </div>
      </div>
    </div>
  );
}
