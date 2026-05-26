"use client";

import Btn from "./Btn";

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs */}
      <div
        style={{
          position: "fixed", top: -200, left: -200, width: 600, height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91,139,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed", bottom: -200, right: -200, width: 500, height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 620,
          textAlign: "center",
          animation: "fadeUp 0.7s ease both",
        }}
      >
        {/* Logo badge */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32,
            background: "rgba(91,139,255,0.12)",
            border: "1px solid rgba(91,139,255,0.2)",
            borderRadius: 100, padding: "6px 16px",
          }}
        >
          <div
            style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "linear-gradient(135deg,#5b8bff,#22d3a5)",
              animation: "pulse-glow 2s infinite",
            }}
          />
          <span
            style={{
              fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 600,
              letterSpacing: 2, textTransform: "uppercase", color: "#818cf8",
            }}
          >
            Ravelo
          </span>
        </div>

        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(36px,6vw,68px)",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            marginBottom: 20,
          }}
        >
          How much is manual
          <br />
          <span
            style={{
              background: "linear-gradient(90deg,#5b8bff,#818cf8,#22d3a5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            work costing you?
          </span>
        </h1>

        <p
          style={{
            fontSize: 18, color: "#94a3b8", lineHeight: 1.7,
            maxWidth: 480, margin: "0 auto 40px",
          }}
        >
          Add your repetitive tasks, set your team size and hourly rates - see
          the real annual cost in seconds.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn onClick={onStart} style={{ fontSize: 16, padding: "14px 32px" }}>
            Calculate My Cost →
          </Btn>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {["Free", "No signup", "2 min"].map((t) => (
              <span key={t} style={{ fontSize: 13, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#22d3a5" }}>✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Floating stats */}
        <div
          style={{
            display: "flex", gap: 16, justifyContent: "center",
            marginTop: 56, flexWrap: "wrap",
          }}
        >
          {[
            { val: "₹8.4L+", label: "avg. yearly waste" },
            { val: "40%",    label: "time automatable" },
            { val: "7 types", label: "of manual tasks" },
          ].map(({ val, label }) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: "20px 28px",
                backdropFilter: "blur(20px)",
                animation: "float 4s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800,
                  background: "linear-gradient(135deg,#5b8bff,#818cf8)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}
              >
                {val}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
