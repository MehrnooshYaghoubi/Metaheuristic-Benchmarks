import { useRef, useState } from "react";
import { AlertCircle, Dna, Play } from "lucide-react";
import { Genetic } from "../Algorithms/Genetic Algorithm/main";
import {
  Button,
  Card,
  Empty,
  Field,
  FieldGroup,
  PageShell,
  Stat,
} from "../components/ui";

/* Operator sets that depend on the chosen representation. Declared once so the
   dropdown options and the validation rules cannot drift apart. */
const CROSSOVERS = {
  Binary: ["Single Point", "Two Point", "Uniform"],
  Permutation: ["Order Crossover", "Cycle Recombination"],
  "Real Number": [
    "Simple Crossover",
    "Simple Arithmetic Crossover",
    "Whole Arithmetic Crossover",
    "BL-x",
  ],
};

const MUTATIONS = {
  Binary: ["Bit Flip Mutation"],
  Permutation: [
    "Swap Mutation",
    "Insert Mutation",
    "Scramble Mutation",
    "Inversion Mutation",
  ],
  "Real Number": ["Complementary Mutation", "Gaussian Mutation"],
};

const DATA_TYPES = ["Binary", "Permutation", "Real Number"];

const FITNESS_FUNCTIONS = [
  "Sum of squares",
  "Rosenbrock",
  "Rastrigin",
  "Traveling Salesman Problem",
];

const A = 10; // Rastrigin constant

export default function GeneticAlgorithm() {
  const fitnessFunction = useRef(null);
  const populationSize = useRef(null);
  const selectionMethod = useRef(null);
  const crossoverType = useRef(null);
  const mutationOperator = useRef(null);
  const mutationProbability = useRef(null);
  const terminationCriteria = useRef(null);
  const crossoverProbability = useRef(null);
  const replacementType = useRef(null);
  const dataType = useRef(null);
  const geneLength = useRef(null);
  const upperBound = useRef(null);
  const lowerBound = useRef(null);
  const maxGenerations = useRef(null);
  const fitnessTreshold = useRef(null);
  const stagnationLimit = useRef(null);
  const timeLimit = useRef(null);
  const convergenceThreshold = useRef(null);

  const [pop, setPop] = useState([]);
  const [bestFitness, setBestFitness] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentDataType, setCurrentDataType] = useState("Binary");
  const [error, setError] = useState(null);

  /**
   * Validates the form. Returns an error message, or null when the
   * configuration is runnable. Same rules as before, reported inline rather
   * than through a stack of alert() dialogs.
   */
  const validate = (v) => {
    const numeric = {
      "population size": v.populationSizeValue,
      "mutation probability": v.mutationProbabilityValue,
      "crossover probability": v.crossoverProbabilityValue,
      "gene length": v.geneLengthValue,
      "lower bound": v.lowerBoundValue,
      "upper bound": v.upperBoundValue,
      "max generations": v.maxGenerationsValue,
      "fitness threshold": v.fitnessThresholdValue,
      "stagnation limit": v.stagnationLimitValue,
      "time limit": v.timeLimitValue,
      "convergence threshold": v.convergenceThresholdValue,
    };
    for (const [name, raw] of Object.entries(numeric)) {
      if (raw === "" || raw === null || isNaN(Number(raw)))
        return `The ${name} must be a number.`;
    }

    if (Number(v.populationSizeValue) <= 0)
      return "Population size must be greater than zero.";
    if (Number(v.geneLengthValue) <= 0)
      return "Gene length must be greater than zero.";
    for (const name of ["mutation", "crossover"]) {
      const val = Number(
        name === "mutation" ? v.mutationProbabilityValue : v.crossoverProbabilityValue
      );
      if (val < 0 || val > 1)
        return `The ${name} probability must be between 0 and 1.`;
    }
    if (Number(v.lowerBoundValue) >= Number(v.upperBoundValue))
      return "The lower bound must be smaller than the upper bound.";

    if (!CROSSOVERS[v.dataTypeValue].includes(v.crossoverTypeValue))
      return `"${v.crossoverTypeValue}" is not a valid crossover for ${v.dataTypeValue} representation.`;
    if (!MUTATIONS[v.dataTypeValue].includes(v.mutationOperatorValue))
      return `"${v.mutationOperatorValue}" is not a valid mutation for ${v.dataTypeValue} representation.`;

    if (
      v.fitnessFunctionValue === "Traveling Salesman Problem" &&
      v.dataTypeValue !== "Permutation"
    )
      return "The Traveling Salesman Problem requires the Permutation data type.";

    return null;
  };

  const buildObjective = (fitnessFunctionValue) => {
    if (fitnessFunctionValue === "Sum of squares") {
      // The GA minimises, so return the raw objective value (optimum 0).
      return (individual) =>
        individual.reduce((sum, gene) => sum + Math.pow(gene, 2), 0);
    }

    if (fitnessFunctionValue === "Rosenbrock") {
      return (ind) => {
        let sum = 0;
        for (let i = 0; i < ind.length - 1; i++) {
          sum += 100 * (ind[i + 1] - ind[i] ** 2) ** 2 + (1 - ind[i]) ** 2;
        }
        return sum; // optimum 0, lower is better
      };
    }

    if (fitnessFunctionValue === "Rastrigin") {
      return (individual) => {
        const n = individual.length;
        let sum = 0;
        for (let i = 0; i < n; i++) {
          const x = individual[i];
          sum += x * x - A * Math.cos(2 * Math.PI * x);
        }
        return A * n + sum; // optimum 0, lower is better
      };
    }

    // Traveling Salesman: random cities, tour length as the objective.
    const cities = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));

    const distance = (cityAIndex, cityBIndex) => {
      const a = cities[cityAIndex];
      const b = cities[cityBIndex];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    return (individual) => {
      let totalDistance = 0;
      for (let i = 0; i < individual.length - 1; i++) {
        totalDistance += distance(individual[i], individual[i + 1]);
      }
      // Return to the starting city to complete the tour
      totalDistance += distance(individual[individual.length - 1], individual[0]);
      return totalDistance; // the GA minimises, so shorter tours win
    };
  };

  const startAlgo = async () => {
    if (isRunning) return;

    const v = {
      fitnessFunctionValue: fitnessFunction.current.value,
      populationSizeValue: populationSize.current.value,
      selectionMethodValue: selectionMethod.current.value,
      crossoverTypeValue: crossoverType.current.value,
      mutationOperatorValue: mutationOperator.current.value,
      mutationProbabilityValue: mutationProbability.current.value,
      terminationCriteriaValue: terminationCriteria.current.value,
      crossoverProbabilityValue: crossoverProbability.current.value,
      dataTypeValue: dataType.current.value,
      replacementTypeValue: replacementType.current.value,
      geneLengthValue: geneLength.current.value,
      upperBoundValue: upperBound.current.value,
      lowerBoundValue: lowerBound.current.value,
      maxGenerationsValue: maxGenerations.current.value,
      fitnessThresholdValue: fitnessTreshold.current.value,
      stagnationLimitValue: stagnationLimit.current.value,
      timeLimitValue: timeLimit.current.value,
      convergenceThresholdValue: convergenceThreshold.current.value,
    };

    const problem = validate(v);
    if (problem) {
      setError(problem);
      return;
    }

    setError(null);
    setIsRunning(true);

    try {
      const gnt = new Genetic(
        parseInt(v.populationSizeValue),
        parseFloat(v.mutationProbabilityValue),
        parseFloat(v.crossoverProbabilityValue),
        buildObjective(v.fitnessFunctionValue),
        v.crossoverTypeValue,
        v.selectionMethodValue,
        v.terminationCriteriaValue,
        v.dataTypeValue,
        v.mutationOperatorValue,
        v.replacementTypeValue,
        parseInt(v.geneLengthValue),
        parseFloat(v.lowerBoundValue),
        parseFloat(v.upperBoundValue),
        parseInt(v.maxGenerationsValue),
        parseFloat(v.fitnessThresholdValue),
        parseFloat(v.stagnationLimitValue),
        parseInt(v.timeLimitValue),
        parseFloat(v.convergenceThresholdValue)
      );

      // Yield once so the button's running state paints before the GA blocks
      // the main thread.
      await new Promise((resolve) => setTimeout(resolve, 0));
      await gnt.runAlgorithm();

      setPop(gnt.top10());
      setBestFitness(gnt.bestfit().toExponential(4));
    } catch (e) {
      setError(e.message ?? String(e));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <PageShell
      title="Genetic Algorithm"
      subtitle="Evolve a population through selection, crossover and mutation"
      actions={
        <Button variant="primary" onClick={startAlgo} disabled={isRunning}>
          <Play size={13} />
          {isRunning ? "Running…" : "Run"}
        </Button>
      }
    >
      <div className="grid grid-cols-1 items-start gap-5 p-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,1fr)]">
        {/* ---- parameters ---- */}
        <div className="flex flex-col gap-5">
          {error && (
            <div className="flex items-start gap-2.5 rounded-lg border border-bad/40 bg-bad/10 px-4 py-3 text-[13px] text-bad">
              <AlertCircle size={15} className="mt-px shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Card title="Problem">
            <FieldGroup title="Representation">
              <Field
                label="Data type"
                options={DATA_TYPES}
                ref={dataType}
                onChange={(e) => setCurrentDataType(e.target.value)}
              />
              <Field
                label="Objective function"
                options={FITNESS_FUNCTIONS}
                ref={fitnessFunction}
              />
              <Field label="Gene length" type="number" defaultValue={20} ref={geneLength} />
              <Field label="Lower bound" type="number" defaultValue={-10} ref={lowerBound} />
              <Field label="Upper bound" type="number" defaultValue={10} ref={upperBound} />
            </FieldGroup>
          </Card>

          <Card title="Operators">
            <div className="flex flex-col gap-6">
              <FieldGroup title="Population & selection">
                <Field
                  label="Population size"
                  type="number"
                  defaultValue={100}
                  ref={populationSize}
                />
                <Field
                  label="Selection method"
                  options={["Random", "Roulette Wheel", "Rank Base", "Tournament", "Truncation"]}
                  ref={selectionMethod}
                />
                <Field
                  label="Replacement"
                  options={[
                    "Elitism",
                    "Generational Replacement",
                    "Steady State Replacement",
                    "Tournament Replacement",
                    "Fitness Based Replacement",
                  ]}
                  ref={replacementType}
                />
              </FieldGroup>

              <FieldGroup title="Variation">
                <Field
                  label="Crossover type"
                  options={CROSSOVERS[currentDataType]}
                  ref={crossoverType}
                />
                <Field
                  label="Crossover probability"
                  type="number"
                  step="0.01"
                  defaultValue={0.7}
                  ref={crossoverProbability}
                />
                <Field
                  label="Mutation operator"
                  options={MUTATIONS[currentDataType]}
                  ref={mutationOperator}
                />
                <Field
                  label="Mutation probability"
                  type="number"
                  step="0.01"
                  defaultValue={0.01}
                  ref={mutationProbability}
                />
              </FieldGroup>
            </div>
          </Card>

          <Card
            title="Termination"
            description="Only the criterion you select ends the run; the rest are ignored."
          >
            <FieldGroup title="Stopping rule">
              <Field
                label="Criterion"
                options={[
                  "Max Generations",
                  "Stagnation Limit",
                  "Fitness Threshold Stop",
                  "Time Limit",
                  "Population Convergence",
                ]}
                ref={terminationCriteria}
              />
              <Field
                label="Max generations"
                type="number"
                defaultValue={100}
                ref={maxGenerations}
              />
              <Field
                label="Fitness threshold"
                type="number"
                step="0.01"
                defaultValue={0.01}
                ref={fitnessTreshold}
              />
              <Field
                label="Stagnation limit"
                type="number"
                defaultValue={10}
                ref={stagnationLimit}
              />
              <Field
                label="Time limit (ms)"
                type="number"
                defaultValue={60000}
                ref={timeLimit}
              />
              <Field
                label="Convergence threshold"
                type="number"
                step="0.001"
                defaultValue={0.001}
                ref={convergenceThreshold}
              />
            </FieldGroup>
          </Card>
        </div>

        {/* ---- results ---- */}
        <div className="flex flex-col gap-5 xl:sticky xl:top-6">
          <Stat
            label="Best objective value"
            value={bestFitness}
            hint="Lower is better"
            tone="accent"
          />

          <Card
            title="Top 10 chromosomes"
            description={pop.length ? "Best first" : undefined}
          >
            {pop.length === 0 ? (
              <Empty
                icon={Dna}
                title={isRunning ? "Evolving…" : "No run yet"}
                hint={
                  isRunning
                    ? "The population is being evolved."
                    : "Set your parameters and press Run to see the best chromosomes."
                }
              />
            ) : (
              <ol className="flex flex-col gap-1.5">
                {pop.map((genes, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 rounded-md border border-line bg-surface-2 px-3 py-2"
                  >
                    <span className="w-4 shrink-0 text-right font-mono text-[11px] text-ink-faint">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-ink-muted">
                      {genes.join(", ")}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
