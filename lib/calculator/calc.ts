import type { Task, TaskResult, CalcResult } from "./types";

const FREQ_TO_YEARLY: Record<string, number> = {
  daily: 250,   // working days
  weekly: 52,
  monthly: 12,
};

export function yearlyForTask(task: Task): TaskResult {
  const instancesPerYear = task.instancesPerPeriod * FREQ_TO_YEARLY[task.frequency];
  const yearlyHours = task.people * (task.minutesPerTask / 60) * instancesPerYear;
  const yearlyCost = Math.round(yearlyHours * task.hourlyCost);
  return { task, yearlyHours, yearlyCost };
}

export function calculate(tasks: Task[]): CalcResult {
  const results = tasks.map(yearlyForTask);
  return {
    tasks: results,
    totalYearlyHours: results.reduce((s, r) => s + r.yearlyHours, 0),
    totalYearlyCost: results.reduce((s, r) => s + r.yearlyCost, 0),
  };
}
