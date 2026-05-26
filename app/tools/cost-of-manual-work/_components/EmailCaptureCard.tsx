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
      <div style={{ textAlign: "center", padding: 40, animation: "fadeUp 0.4s ease both" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>
          You are on the list!
        </h3>
        <p style={{ color: "#94a3b8" }}>We will reach out with a personalised automation plan.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 24px", animation: "fadeUp 0.4s ease both" }}>
      <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, marginBottom: 8 }}>
        Want a free automation plan?
      </h3>
      <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>
        We will review your tasks and show you exactly what can be automated - no commitment needed.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
        />
        <Btn
          onClick={handleSubmit}
          disabled={!email.includes("@") || loading}
          style={{ width: "100%", justifyContent: "center" }}
        >
          {loading ? "Sending..." : "Get My Automation Plan"}
        </Btn>
        <button
          onClick={onSkip}
          style={{ background: "none", border: "none", color: "#6b7280", fontSize: 13, cursor: "pointer", padding: 4 }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
