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

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 24px 96px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 12 }}>
        <div>
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", color: "#6b7280", fontSize: 13, cursor: "pointer", marginBottom: 8, padding: 0, display: "flex", alignItems: "center", gap: 4 }}
          >
            ← Back
          </button>
          <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: 32, fontWeight: 800 }}>
            Add your tasks
          </h2>
          <p style={{ color: "#6b7280", fontSize: 15, marginTop: 6 }}>
            The more tasks you add, the more accurate your number.
          </p>
        </div>
        <CurrencySelect value={currency} onChange={onCurrencyChange} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {tasks.length === 0 && (
          <div
            style={{
              textAlign: "center", padding: "60px 20px",
              border: "2px dashed rgba(255,255,255,0.07)",
              borderRadius: 16, color: "#6b7280",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p>No tasks yet. Add one below or pick from presets.</p>
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, flexWrap: "wrap", gap: 12 }}>
        <Btn onClick={addTask} variant="ghost">+ Add Custom Task</Btn>
        <Btn
          onClick={onCalculate}
          disabled={tasks.length === 0}
          style={{ fontSize: 15, padding: "12px 28px" }}
        >
          See My Annual Cost →
        </Btn>
      </div>
    </div>
  );
}
