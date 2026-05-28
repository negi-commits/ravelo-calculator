"use client";

import { useEffect, useState } from "react";
import { CalcResult } from "@/lib/calculator/types";
import { AUTO_META } from "@/lib/calculator/automatability";
import { CurrencyCode, formatMoney } from "@/lib/currency";
import Btn from "./Btn";

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let frame: number;
    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * ease));
      if (p < 1) frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return val;
}

interface ResultsScreenProps {
  result: CalcResult;
  currency: CurrencyCode;
  onReset: () => void;
  onShowShare: () => void;
}

export default function ResultsScreen({ result, currency, onReset, onShowShare }: ResultsScreenProps) {
  const maxCost = Math.max(...result.tasks.map((r) => r.yearlyCost), 1);
  const countedCost = useCountUp(result.totalYearlyCost);
  const countedHours = useCountUp(Math.round(result.totalYearlyHours));

  return (
    <div
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        // Big bottom pad so the email slide-up never covers the CTA.
        padding: "clamp(36px, 7vw, 64px) clamp(16px, 4vw, 32px) clamp(280px, 40vw, 320px)",
      }}
    >
      {/* Hero */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "clamp(36px, 7vw, 64px)",
          animation: "fadeUp 0.6s ease both",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 100,
            padding: "6px 14px",
            fontSize: 11.5, color: "#f87171", fontWeight: 600,
            letterSpacing: 1, textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          Your Annual Manual Work Cost
        </div>

        <div
          style={{
            fontFamily: "'Instrument Serif', serif", fontWeight: 400,
            fontStyle: "italic",
            lineHeight: 1, letterSpacing: "-0.02em",
            marginBottom: 14,
            fontSize: "clamp(56px, 15vw, 128px)",
            background: "linear-gradient(90deg,#f87171,#fb923c)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            wordBreak: "break-word",
          }}
        >
          {formatMoney(countedCost, currency)}
        </div>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "clamp(14px, 3.6vw, 18px)",
            maxWidth: 460, margin: "0 auto",
          }}
        >
          is being lost to repetitive manual work every year
        </p>
      </div>

      {/* 3 Stat cards */}
      <div
        className="stat-grid"
        style={{ marginBottom: "clamp(36px, 7vw, 56px)" }}
      >
        {[
          { label: "Yearly Hours Lost",   value: `${countedHours.toLocaleString()} hrs`, icon: "⏱️", color: "#818cf8" },
          { label: "Tasks Analyzed",      value: result.tasks.length,                    icon: "📋", color: "#5b8bff" },
          { label: "Potential Savings",   value: formatMoney(result.totalYearlyCost * 0.7, currency), icon: "💡", color: "#22d3a5", note: "~70% automatable" },
        ].map(({ label, value, icon, color, note }, i) => (
          <div
            key={label}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "clamp(18px, 4vw, 30px) clamp(18px, 4vw, 28px)",
              animation: `fadeUp 0.55s ${i * 0.08}s ease both`,
              minWidth: 0,
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
            <div
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: "clamp(28px, 6.5vw, 38px)",
                fontWeight: 400, lineHeight: 1.05, color,
                wordBreak: "break-word",
                letterSpacing: "-0.01em",
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>{label}</div>
            {note && <div style={{ fontSize: 11, color: "#22d3a5", marginTop: 4 }}>{note}</div>}
          </div>
        ))}
      </div>

      {/* Task breakdown */}
      <div
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 18, overflow: "hidden",
          marginBottom: "clamp(28px, 5vw, 40px)",
        }}
      >
        <div
          style={{
            padding: "18px clamp(18px, 4vw, 28px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 22, fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            Task Breakdown
          </h3>
        </div>
        {result.tasks.map((r, i) => {
          const pct = (r.yearlyCost / maxCost) * 100;
          const badge = AUTO_META[r.task.automatability];
          return (
            <div
              key={r.task.id}
              style={{
                padding: "16px clamp(18px, 4vw, 28px)",
                borderBottom: i < result.tasks.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                animation: `fadeUp 0.5s ${i * 0.06}s both`,
              }}
            >
              <div
                style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 10,
                  flexWrap: "wrap", gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <span
                    style={{
                      fontWeight: 500, fontSize: 14,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}
                  >
                    {r.task.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 20,
                      background: `${badge.color}1a`, color: badge.color, flexShrink: 0,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex", gap: 14, fontSize: 13,
                    color: "#94a3b8", marginLeft: "auto",
                  }}
                >
                  <span>{Math.round(r.yearlyHours).toLocaleString()} hrs/yr</span>
                  <span
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontSize: 17, fontWeight: 400,
                      color: "#e8eaf2", letterSpacing: "-0.01em",
                    }}
                  >
                    {formatMoney(r.yearlyCost, currency)}
                  </span>
                </div>
              </div>
              <div
                style={{
                  height: 6,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 3, overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%", borderRadius: 3,
                    background: `linear-gradient(90deg, ${badge.color}88, ${badge.color})`,
                    width: `${pct}%`,
                    animation: `bar-grow 1s ${i * 0.1}s ease both`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div
        style={{
          background: "linear-gradient(135deg,rgba(91,139,255,0.1),rgba(34,211,165,0.08))",
          border: "1px solid rgba(91,139,255,0.2)",
          borderRadius: 18,
          padding: "clamp(28px, 6vw, 40px) clamp(20px, 4vw, 44px)",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            fontFamily: "'Instrument Serif', serif", fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(22px, 5vw, 28px)", marginBottom: 10,
            letterSpacing: "-0.01em",
          }}
        >
          Ready to automate this?
        </h3>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "clamp(13.5px, 3.4vw, 15px)",
            marginBottom: 22,
            maxWidth: 420, marginLeft: "auto", marginRight: "auto",
          }}
        >
          Ravelo helps businesses eliminate repetitive work and reclaim their time.
        </p>
        <div
          style={{
            display: "flex", justifyContent: "center",
            gap: 10, flexWrap: "wrap",
          }}
        >
          <Btn variant="teal" style={{ fontSize: 15, padding: "12px 24px" }}>
            Get a Free Consultation
          </Btn>
          <Btn variant="ghost" onClick={onShowShare}>📤 Share Results</Btn>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={onReset}
          style={{
            background: "none", border: "none",
            color: "#6b7280", fontSize: 13,
            cursor: "pointer", textDecoration: "underline",
            padding: 8,
          }}
        >
          Start over with different tasks
        </button>
      </div>
    </div>
  );
}
