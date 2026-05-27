import CalculatorFlow from "./tools/cost-of-manual-work/_components/CalculatorFlow";

// The calculator is the whole site, so serve it at the root URL directly
// (no redirect to /tools/cost-of-manual-work). That deeper path still works too.
export default function Home() {
  return <CalculatorFlow />;
}
