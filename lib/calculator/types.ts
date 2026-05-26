export type Frequency = "daily" | "weekly" | "monthly";
export type Automatability = "full" | "partial" | "unlikely";
export type CurrencyCode = "USD" | "INR" | "AED";

export interface Task {
  id: string;
  name: string;
  people: number;
  minutesPerTask: number;
  frequency: Frequency;
  instancesPerPeriod: number;
  hourlyCost: number;
  automatability: Automatability;
}

export interface TaskResult {
  task: Task;
  yearlyHours: number;
  yearlyCost: number;
}

export interface CalcResult {
  tasks: TaskResult[];
  totalYearlyHours: number;
  totalYearlyCost: number;
}

export interface Preset {
  key: string;
  label: string;
  icon: string;
  automatability: Automatability;
  people: number;
  minutesPerTask: number;
  frequency: Frequency;
  instancesPerPeriod: number;
}
