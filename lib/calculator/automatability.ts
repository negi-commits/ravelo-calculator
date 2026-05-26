import type { Automatability } from "./types";

export const AUTO_META: Record<
  Automatability,
  { label: string; color: string }
> = {
  full:     { label: "Fully Automatable",     color: "#22d3a5" },
  partial:  { label: "Partially Automatable", color: "#f59e0b" },
  unlikely: { label: "Hard to Automate",      color: "#94a3b8" },
};
