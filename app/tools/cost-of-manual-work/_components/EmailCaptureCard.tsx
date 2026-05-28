"use client";

import { useState } from "react";
import Btn from "./Btn";

interface EmailCaptureCardProps {
  onSubmit: (data: { email: string; name: string }) => void;
  onSkip: () => void;
  payload?: any;
}

export default function EmailCaptureCard({ onSubmit, onSkip, payload }: EmailCaptureCardProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "cost-calculator", payload }),
      });
    } catch {
      // fail silently - never block the user
    }
    setSubmitted(true);
    setLoading(false);
    onSubmit({ email, name });
  }

  if (submitted) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "32px 20px",
          animation: "fadeUp 0.4s ease both",
        }}
      >
        <div style={{ fontSize: 44, marginBottom: 14 }}>🎉</div>
        <h3
          style={{
            fontFamily: "Syne, sans-serif", fontWeight: 700,
            fontSize: 20, marginBottom: 6,
          }}
        >
          You are on the list!
        </h3>
        <p style={{ color: "#94a3b8", fontSize: 14 }}>
          We will reach out with a personalised automation plan.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        maxWidth: 440,
        margin: "0 auto",
        padding: "clamp(20px, 5vw, 32px) clamp(18px, 4vw, 24px)",
        paddingBottom: "calc(clamp(20px, 5vw, 32px) + env(safe-area-inset-bottom))",
        animation: "fadeUp 0.4s ease both",
      }}
    >
      <button
        onClick={onSkip}
        aria-label="Dismiss"
        style={{
          position: "absolute", top: 10, right: 12,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#94a3b8", borderRadius: 999,
          width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 18, lineHeight: 1,
        }}
      >
        ×
      </button>

      <h3
        style={{
          fontFamily: "Syne, sans-serif", fontWeight: 800,
          fontSize: "clamp(18px, 4.5vw, 22px)",
          marginBottom: 8,
        }}
      >
        Want a free automation plan?
      </h3>
      <p
        style={{
          color: "#94a3b8",
          fontSize: "clamp(13px, 3.4vw, 14px)",
          marginBottom: 20, lineHeight: 1.5,
        }}
      >
        We will review your tasks and show you exactly what can be automated — no commitment.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Work email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          inputMode="email"
          autoComplete="email"
        />
        <Btn
          onClick={handleSubmit}
          disabled={!email.includes("@") || loading}
          style={{ width: "100%", justifyContent: "center", padding: "13px 20px" }}
        >
          {loading ? "Sending..." : "Get My Automation Plan"}
        </Btn>
        <button
          onClick={onSkip}
          style={{
            background: "none", border: "none",
            color: "#6b7280", fontSize: 13,
            cursor: "pointer", padding: 6,
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
