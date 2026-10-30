import { NavLink } from "react-router";
import { Dna, Bird, Table2, ArrowRight } from "lucide-react";
import Header from "./titlebar";

const destinations = [
  {
    to: "/ga",
    icon: Dna,
    title: "Genetic Algorithm",
    body: "Evolve a population with selection, crossover and mutation. Configure every operator and watch the best chromosomes.",
  },
  {
    to: "/pso",
    icon: Bird,
    title: "Particle Swarm",
    body: "Drive a swarm through the search space with inertia, cognitive and social terms. Plots convergence and particle positions.",
  },
  {
    to: "/tables",
    icon: Table2,
    title: "Benchmark Results",
    body: "All 67 test functions with their properties, plus a head-to-head comparison of GA and PSO. Exports to CSV, XLSX and PDF.",
  },
];

export default function App() {
  return (
    <div className="flex h-full flex-col bg-base">
      <Header />
      <main className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-8 py-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-medium tracking-wide text-ink-muted">
              67 benchmark functions
            </span>
            <h1 className="mt-5 text-4xl leading-[1.1] font-semibold tracking-tight text-balance">
              Metaheuristic algorithms,
              <br />
              measured side by side.
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-muted text-pretty">
              Run a Genetic Algorithm or Particle Swarm Optimization against a
              standard benchmark suite, then compare their results under a
              matched evaluation budget.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            {destinations.map(({ to, icon: Icon, title, body }) => (
              <NavLink
                key={to}
                to={to}
                className="group flex flex-col rounded-[12px] border border-line bg-surface p-5 transition-colors hover:border-line-strong hover:bg-surface-2"
              >
                <Icon size={18} className="text-accent" />
                <h2 className="mt-4 text-[14px] font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-muted">
                  {body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-ink-faint transition-colors group-hover:text-accent">
                  Open
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
