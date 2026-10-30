import { useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertCircle, Play, TrendingDown, Waypoints } from "lucide-react";
import { StandardPSO } from "../Algorithms/PSO/pso";
import {
  Button,
  Card,
  Checkbox,
  Empty,
  Field,
  FieldGroup,
  PageShell,
  Stat,
} from "../components/ui";

const TARGETS = ["Sum of squares", "Rosenbrock", "Rastrigin"];

/* Objective functions, all minimised (optimum 0).
   These previously had two defects: Rosenbrock indexed x[-1] on the first
   term, yielding NaN for every evaluation, and Rastrigin omitted its cosine
   term entirely, which made it a plain quadratic. */
const OBJECTIVES = {
  "Sum of squares": (x) => x.reduce((sum, val) => sum + val ** 2, 0),

  Rosenbrock: (x) => {
    let sum = 0;
    for (let i = 0; i < x.length - 1; i++) {
      sum += 100 * (x[i + 1] - x[i] ** 2) ** 2 + (1 - x[i]) ** 2;
    }
    return sum;
  },

  Rastrigin: (x) =>
    10 * x.length +
    x.reduce((sum, val) => sum + (val ** 2 - 10 * Math.cos(2 * Math.PI * val)), 0),
};

const chartAxis = {
  stroke: "#5c6478",
  tick: { fill: "#8b93a7", fontSize: 11 },
};

const tooltipStyle = {
  contentStyle: {
    background: "#161920",
    border: "1px solid #323847",
    borderRadius: 8,
    fontSize: 12,
  },
  labelStyle: { color: "#8b93a7" },
};

export default function PSO() {
  const populationSizeRef = useRef(null);
  const dimensionRef = useRef(null);
  const lowerBoundRef = useRef(null);
  const upperBoundRef = useRef(null);
  const targetFunctionRef = useRef(null);
  const inertiaWeightRef = useRef(null);
  const cognitiveRef = useRef(null);
  const socialRef = useRef(null);
  const numOfIterationsRef = useRef(null);

  const [positions, setPositions] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [optimalValue, setOptimalValue] = useState(null);
  const [dimension, setDimension] = useState(2);
  const [isWrandom, setWrandom] = useState(false);
  const [gBest, setGBest] = useState(null);
  const [data, setData] = useState([]);
  const [bounds, setBounds] = useState([-10, 10]);
  const [error, setError] = useState(null);

  const handleStart = async () => {
    if (isRunning) return;

    const populationSize = parseInt(populationSizeRef.current.value);
    const dim = parseInt(dimensionRef.current.value);
    const lowerBound = parseFloat(lowerBoundRef.current.value);
    const upperBound = parseFloat(upperBoundRef.current.value);
    const iterations = parseInt(numOfIterationsRef.current.value);
    const W = parseFloat(inertiaWeightRef.current.value);
    const c1 = parseFloat(cognitiveRef.current.value);
    const c2 = parseFloat(socialRef.current.value);

    const invalid = [
      [populationSize, "population size"],
      [dim, "dimension"],
      [lowerBound, "lower bound"],
      [upperBound, "upper bound"],
      [iterations, "number of iterations"],
      [c1, "cognitive coefficient"],
      [c2, "social coefficient"],
      ...(isWrandom ? [] : [[W, "inertia weight"]]),
    ].find(([value]) => isNaN(value));

    if (invalid) {
      setError(`Please enter a number for the ${invalid[1]}.`);
      return;
    }
    if (populationSize <= 0 || dim <= 0 || iterations <= 0) {
      setError(
        "Population size, dimension and number of iterations must all be greater than zero."
      );
      return;
    }
    if (lowerBound >= upperBound) {
      setError("The lower bound must be smaller than the upper bound.");
      return;
    }

    setError(null);
    setIsRunning(true);
    setBounds([lowerBound, upperBound]);
    setDimension(dim);
    setData([]);

    try {
      const objective = OBJECTIVES[targetFunctionRef.current.value];
      // StandardPSO is budgeted in fitness calls, not iterations. One
      // iteration evaluates every particle once, so convert before calling —
      // passing the raw iteration count made 200 "iterations" mean 200 total
      // evaluations, i.e. about four actual sweeps of a 50-particle swarm.
      const result = await StandardPSO(
        populationSize,
        dim,
        lowerBound,
        upperBound,
        iterations * populationSize,
        async (x) => objective(x),
        W,
        c1,
        c2,
        setPositions,
        isWrandom,
        0.726,
        setData
      );

      setGBest(result.gbest.map((e) => e.toFixed(5)).join(", "));
      setOptimalValue(result.bestFitness.toExponential(4));
    } catch (e) {
      setError(e.message ?? String(e));
    } finally {
      setIsRunning(false);
    }
  };

  const hasRun = optimalValue !== null;

  // A log y-axis only works while every plotted value is strictly positive;
  // fall back to linear if the objective ever reaches exactly zero.
  const useLogScale = data.length > 0 && data.every((d) => d.best > 0);

  return (
    <PageShell
      title="Particle Swarm Optimization"
      subtitle="Drive a swarm with inertia, cognitive and social terms"
      actions={
        <Button variant="primary" onClick={handleStart} disabled={isRunning}>
          <Play size={13} />
          {isRunning ? "Running…" : "Run"}
        </Button>
      }
    >
      <div className="grid grid-cols-1 items-start gap-5 p-6 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,1.15fr)]">
        {/* ---- parameters ---- */}
        <div className="flex flex-col gap-5">
          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-bad/40 bg-bad/10 px-4 py-3 text-[13px] text-bad">
              <AlertCircle size={15} className="mt-px shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Card title="Problem">
            <FieldGroup title="Search space">
              <Field label="Target function" options={TARGETS} ref={targetFunctionRef} />
              <Field
                label="Dimension"
                type="number"
                defaultValue={2}
                ref={dimensionRef}
                onChange={(e) => setDimension(parseInt(e.target.value))}
              />
              <Field label="Lower bound" type="number" defaultValue={-10} ref={lowerBoundRef} />
              <Field label="Upper bound" type="number" defaultValue={10} ref={upperBoundRef} />
            </FieldGroup>
          </Card>

          <Card title="Swarm">
            <FieldGroup title="Coefficients">
              <Field
                label="Population size"
                type="number"
                defaultValue={50}
                ref={populationSizeRef}
              />
              <Field
                label="Iterations"
                type="number"
                defaultValue={200}
                ref={numOfIterationsRef}
              />
              <Field
                label="Inertia weight"
                type="number"
                step="0.001"
                defaultValue={0.729}
                disabled={isWrandom}
                ref={inertiaWeightRef}
              />
              <Field
                label="Cognitive coefficient"
                type="number"
                step="0.001"
                defaultValue={1.49445}
                ref={cognitiveRef}
              />
              <Field
                label="Social coefficient"
                type="number"
                step="0.001"
                defaultValue={1.49445}
                ref={socialRef}
              />
            </FieldGroup>
            <div className="mt-4 border-t border-line pt-4">
              <Checkbox
                label="Randomise inertia weight with a logistic map"
                checked={isWrandom}
                onChange={(e) => setWrandom(e.target.checked)}
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Stat
              label="Best objective"
              value={optimalValue}
              hint="Lower is better"
              tone="accent"
            />
            <Stat label="Global best position" value={gBest} />
          </div>
        </div>

        {/* ---- charts ---- */}
        <div className="flex flex-col gap-5 xl:sticky xl:top-6">
          <Card title="Convergence" description="Best objective value per evaluation">
            <div className="h-56">
              {data.length === 0 ? (
                <Empty
                  icon={TrendingDown}
                  title={isRunning ? "Running…" : "No run yet"}
                  hint="Convergence is plotted as the swarm improves."
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                    <CartesianGrid stroke="#232732" vertical={false} />
                    <XAxis
                      dataKey="fitnessCalls"
                      type="number"
                      domain={["dataMin", "dataMax"]}
                      {...chartAxis}
                    />
                    {/* Convergence spans many orders of magnitude, so a linear
                        axis collapses the whole run onto zero. Log is only
                        valid while every value is positive. */}
                    <YAxis
                      {...chartAxis}
                      width={72}
                      scale={useLogScale ? "log" : "linear"}
                      domain={useLogScale ? ["auto", "auto"] : undefined}
                      tickFormatter={(v) => (v === 0 ? "0" : v.toExponential(0))}
                    />
                    <Tooltip
                      {...tooltipStyle}
                      formatter={(v) => [Number(v).toExponential(4), "best"]}
                      labelFormatter={(v) => `${v} evaluations`}
                    />
                    <Line
                      type="monotone"
                      dataKey="best"
                      stroke="#4c8dff"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card
            title="Particle positions"
            description={
              dimension <= 2 ? "First two dimensions" : `${dimension}D — not plottable`
            }
          >
            <div className="h-72">
              {dimension > 2 ? (
                <Empty
                  icon={Waypoints}
                  title="Too many dimensions to plot"
                  hint="Particle positions can only be drawn for 1 or 2 dimensions."
                />
              ) : positions.length === 0 ? (
                <Empty
                  icon={Waypoints}
                  title={isRunning ? "Running…" : "No run yet"}
                  hint="Particles appear here as the swarm moves."
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
                    <CartesianGrid stroke="#232732" />
                    <XAxis type="number" dataKey="x" name="x" domain={bounds} {...chartAxis} />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="y"
                      domain={bounds}
                      width={64}
                      {...chartAxis}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} {...tooltipStyle} />
                    <Scatter
                      name="Particles"
                      data={positions}
                      fill="#4c8dff"
                      isAnimationActive={false}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {!hasRun && !isRunning && (
            <p className="text-center text-xs text-ink-faint">
              Press Run to start the swarm.
            </p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
