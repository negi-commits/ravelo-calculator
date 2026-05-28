"use client";

import Btn from "./Btn";

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(32px, 8vw, 64px) clamp(20px, 5vw, 32px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs */}
      <div
        aria-hidden
        style={{
          position: "fixed", top: "-30vw", left: "-30vw",
          width: "60vw", height: "60vw", maxWidth: 600, maxHeight: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91,139,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed", bottom: "-25vw", right: "-25vw",
          width: "50vw", height: "50vw", maxWidth: 500, maxHeight: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(129,140,248,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 620,
          width: "100%",
          textAlign: "center",
          animation: "fadeUp 0.7s ease both",
        }}
      >
        {/* Logo badge */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            marginBottom: "clamp(20px, 4vw, 32px)",
            background: "rgba(91,139,255,0.12)",
            border: "1px solid rgba(91,139,255,0.2)",
            borderRadius: 100, padding: "6px 14px",
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
              fontFamily: "'Inter', sans-serif", fontSize: 11.5, fontWeight: 600,
              letterSpacing: 2.5, textTransform: "uppercase", color: "#818cf8",
            }}
          >
            Ravelo
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(40px, 10vw, 84px)",
            fontWeight: 400,
            lineHeight: 1.02,
            letterSpacing: "-0.015em",
            marginBottom: "clamp(14px, 3vw, 20px)",
          }}
        >
          How much is manual
          <br />
          <span
            style={{
              fontStyle: "italic",
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
            fontSize: "clamp(15px, 3.6vw, 18px)",
            color: "#94a3b8", lineHeight: 1.6,
            maxWidth: 480,
            margin: "0 auto clamp(28px, 5vw, 40px)",
          }}
        >
          Add your repetitive tasks, set your team size and hourly rates — see
          the real annual cost in seconds.
        </p>

        <div
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 14,
          }}
        >
          <Btn
            onClick={onStart}
            style={{
              fontSize: 16, padding: "14px 28px",
              width: "100%", maxWidth: 320, justifyContent: "center",
            }}
          >
            Calculate My Cost →
          </Btn>
          <div
            style={{
              display: "flex", gap: 14, alignItems: "center",
              flexWrap: "wrap", justifyContent: "center",
            }}
          >
            {["Free", "No signup", "2 min"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 13, color: "#6b7280",
                  display: "inline-flex", alignItems: "center", gap: 4,
                }}
              >
                <span style={{ color: "#22d3a5" }}>✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Floating stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "clamp(8px, 2vw, 16px)",
            marginTop: "clamp(40px, 8vw, 56px)",
          }}
        >
          {[
            { val: "₹8.4L+", label: "avg. yearly waste" },
            { val: "40%",    label: "time automatable" },
            { val: "7 types", label: "of manual tasks" },
          ].map(({ val, label }, i) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "clamp(14px, 3vw, 22px) clamp(10px, 2.5vw, 24px)",
                backdropFilter: "blur(20px)",
                animation: `float 4s ease-in-out ${i * 0.4}s infinite`,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: "clamp(22px, 5.5vw, 32px)",
                  fontWeight: 400,
                  lineHeight: 1,
                  background: "linear-gradient(135deg,#5b8bff,#818cf8)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontSize: "clamp(10px, 2.6vw, 12px)",
                  color: "#6b7280", marginTop: 4,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
