"use client";

import { useState } from "react";
import { Task, CalcResult } from "@/lib/calculator/types";
import { CurrencyCode, CURRENCIES } from "@/lib/currency";
import { calculate } from "@/lib/calculator/calc";
import IntroScreen from "./IntroScreen";
import CalculatorScreen from "./CalculatorScreen";
import ResultsScreen from "./ResultsScreen";
import ShareCard from "./ShareCard";
import EmailCaptureCard from "./EmailCaptureCard";

type Screen = "intro" | "calculator" | "results";

export default function CalculatorFlow() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  function handleCurrencyChange(c: CurrencyCode) {
    setCurrency(c);
    setTasks((prev) =>
      prev.map((t) => ({ ...t, hourlyCost: CURRENCIES[c].defaultHourly }))
    );
  }

  function handleCalculate() {
    if (tasks.length === 0) return;
    const r = calculate(tasks);
    setResult(r);
    setScreen("results");
    setTimeout(() => setShowEmail(true), 3000);
  }

  function handleReset() {
    setTasks([]);
    setResult(null);
    setShowEmail(false);
    setShowShare(false);
    setScreen("calculator");
  }

  return (
    <>
      {/* Ambient background glow */}
      <div
        style={{
          position: "fixed", inset: 0,
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(91,139,255,0.08), transparent)",
          pointerEvents: "none", zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {screen === "intro" && (
          <IntroScreen onStart={() => setScreen("calculator")} />
        )}

        {screen === "calculator" && (
          <CalculatorScreen
            tasks={tasks}
            currency={currency}
            onTasksChange={setTasks}
            onCurrencyChange={handleCurrencyChange}
            onCalculate={handleCalculate}
            onBack={() => setScreen("intro")}
          />
        )}

        {screen === "results" && result && (
          <>
            <ResultsScreen
              result={result}
              currency={currency}
              onReset={handleReset}
              onShowShare={() => setShowShare(true)}
            />

            {/* Email capture slide-up */}
            {showEmail && (
              <div
                style={{
                  position: "fixed",
                  bottom: 0, left: 0, right: 0,
                  background: "rgba(6,6,14,0.97)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderTop: "1px solid rgba(91,139,255,0.2)",
                  boxShadow: "0 -12px 40px rgba(0,0,0,0.4)",
                  zIndex: 50,
                  animation: "fadeUp 0.5s ease both",
                  maxHeight: "85svh",
                  overflowY: "auto",
                }}
              >
                <EmailCaptureCard
                  onSubmit={() => setShowEmail(false)}
                  onSkip={() => setShowEmail(false)}
                  payload={{ result, currency }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Share modal */}
      {showShare && result && (
        <ShareCard
          result={result}
          currency={currency}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
}
