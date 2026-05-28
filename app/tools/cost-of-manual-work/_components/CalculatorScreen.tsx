"use client";

import { Task, Preset } from "@/lib/calculator/types";
import { CurrencyCode, CURRENCIES } from "@/lib/currency";
import TaskRow from "./TaskRow";
import PresetPicker from "./PresetPicker";
import CurrencySelect from "./CurrencySelect";
import Btn from "./Btn";

let taskIdCounter = 1;

function newTask(currency: CurrencyCode, overrides: Partial<Task> = {}): Task {
  return {
    id: `task-${taskIdCounter++}`,
    name: "Custom Task",
    people: 1,
    minutesPerTask: 30,
    frequency: "weekly",
    instancesPerPeriod: 1,
    hourlyCost: CURRENCIES[currency].defaultHourly,
    automatability: "partial",
    ...overrides,
  };
}

interface CalculatorScreenProps {
  tasks: Task[];
  currency: CurrencyCode;
  onTasksChange: (tasks: Task[]) => void;
  onCurrencyChange: (c: CurrencyCode) => void;
  onCalculate: () => void;
  onBack: () => void;
}

export default function CalculatorScreen({
  tasks, currency, onTasksChange, onCurrencyChange, onCalculate, onBack,
}: CalculatorScreenProps) {

  function addTask() {
    onTasksChange([...tasks, newTask(currency)]);
  }

  function addPreset(p: Preset) {
    onTasksChange([
      ...tasks,
      newTask(currency, {
        name: p.label,
        people: p.people,
        minutesPerTask: p.minutesPerTask,
        frequency: p.frequency,
        instancesPerPeriod: p.instancesPerPeriod,
        automatability: p.automatability,
      }),
    ]);
  }

  function updateTask(id: string, updated: Task) {
    onTasksChange(tasks.map((t) => (t.id === id ? updated : t)));
  }

  function removeTask(id: string) {
    onTasksChange(tasks.filter((t) => t.id !== id));
  }

  const canCalculate = tasks.length > 0;

  return (
    <div
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "clamp(28px, 6vw, 64px) clamp(16px, 4vw, 32px) clamp(120px, 18vw, 96px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "clamp(24px, 5vw, 40px)",
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <button
            onClick={onBack}
            style={{
              background: "none", border: "none", color: "#6b7280",
              fontSize: 13, cursor: "pointer", marginBottom: 8, padding: 0,
              display: "inline-flex", alignItems: "center", gap: 4,
            }}
          >
            ← Back
          </button>
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(24px, 5.5vw, 32px)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Add your tasks
          </h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "clamp(13px, 3.4vw, 15px)",
              marginTop: 6,
            }}
          >
            The more tasks you add, the more accurate your number.
          </p>
        </div>
        <CurrencySelect value={currency} onChange={onCurrencyChange} />
      </div>

      <div
        style={{
          display: "flex", flexDirection: "column",
          gap: 12, marginBottom: 20,
        }}
      >
        {tasks.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "clamp(40px, 8vw, 60px) 20px",
              border: "2px dashed rgba(255,255,255,0.07)",
              borderRadius: 16, color: "#6b7280",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>📋</div>
            <p style={{ fontSize: 14 }}>
              No tasks yet. Pick a preset below or add a custom one.
            </p>
          </div>
        )}
        {tasks.map((t, i) => (
          <TaskRow
            key={t.id} task={t} currency={currency} index={i}
            onChange={(updated) => updateTask(t.id, updated)}
            onRemove={() => removeTask(t.id)}
          />
        ))}
      </div>

      <PresetPicker onAdd={addPreset} />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 24,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Btn
          onClick={addTask}
          variant="ghost"
          style={{ flex: "1 1 auto", justifyContent: "center", minWidth: 140 }}
        >
          + Add Custom Task
        </Btn>
        <Btn
          onClick={onCalculate}
          disabled={!canCalculate}
          style={{
            fontSize: 15, padding: "12px 24px",
            flex: "1 1 auto", justifyContent: "center", minWidth: 180,
          }}
        >
          See My Annual Cost →
        </Btn>
      </div>
    </div>
  );
}
