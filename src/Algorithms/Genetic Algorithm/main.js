import { crossover } from "./crossover.js";
import { createPopulation } from "./initialization.js";
import { mutation } from "./mutation.js";
import { replacement } from "./replacement.js";
import { selection } from "./selection.js";
import { stopCondition } from "./stop_condition.js";
import { safeObjective } from "./safe.js";
import { normaliseBounds, clampToBounds } from "../Benchmarks/bounds.js";



export class Genetic {
  constructor(
    populationSize,
    mutationRate,
    crossoverRate,
    fitnessFunction,
    crossoverType,
    selectionType,
    terminationCriteria,
    dataType,
    mutationType,
    replacementType,
    geneLength = 20,
    lowerBound = -10.0,
    upperBound = 10.0,
    maxGenerations = 100,
    fitnessThreshold = 0.01,
    stagnationLimit = 10,
    timeLimit = 60000,
    convergenceThreshold = 0.001,
    maxFitnessCalls = Infinity
  ) {
    this.populationSize = populationSize;
    this.mutationRate = mutationRate;
    this.crossoverRate = crossoverRate;
    // Count objective evaluations so the GA can be given the same budget as
    // PSO; without this the two algorithms were compared at wildly different
    // numbers of fitness calls (generations vs. calls).
    this.fitnessCalls = 0;
    this.bestEver = Infinity;
    this.maxFitnessCalls = maxFitnessCalls;
    this.fitnessFunction = (individual) => {
      this.fitnessCalls++;
      return fitnessFunction(individual);
    };
    // Un-counted version, for reporting after the run has finished.
    this.rawFitnessFunction = fitnessFunction;
    this.population = [];
    this.crossoverType = crossoverType;
    this.selectionType = selectionType;
    this.terminationCriteria = terminationCriteria;
    this.dataType = dataType;
    this.mutationType = mutationType;
    this.replacementType = replacementType;
    this.geneLength = Number(geneLength);
    // Bounds may be scalars or per-gene arrays; normaliseBounds also guards
    // against a caller passing the pair in the wrong order.
    const { lower, upper } = normaliseBounds(
      lowerBound,
      upperBound,
      this.geneLength
    );
    this.lowerBound = lower;
    this.upperBound = upper;
    this.maxGenerations = maxGenerations;
    this.fitnessThreshold = fitnessThreshold;
    this.stagnationLimit = stagnationLimit;
    this.timeLimit = timeLimit;
    this.convergenceThreshold = convergenceThreshold;
  }
  async runAlgorithm() {
    this.population = createPopulation(
      this.populationSize,
      this.geneLength,
      this.dataType,
      { lowerBound: this.lowerBound, upperBound: this.upperBound }
    );

    let generationCount = 0;
    const startTime = Date.now();
    let bestFitnessHistory = [];
    let bestFitness = Infinity;

    while (true) {
      if (this.fitnessCalls >= this.maxFitnessCalls) break;
      let newGeneration = [];

      while (newGeneration.length < this.population.length) {
        if (Math.random() < this.crossoverRate) {
          let [dad, mom] = selection(
            this.population,
            this.fitnessFunction,
            this.selectionType
          );

          if (!dad || !mom) continue;

          let offspring = crossover(this.crossoverType, dad, mom).offspring;

          offspring = offspring.map((child) => {
            if (!child) return [];
            // mutate
            child = mutation(
              child,
              this.mutationRate,
              this.mutationType,
              this.lowerBound,
              this.upperBound
            );

            // clamp to valid range
            child = clampToBounds(child, this.lowerBound, this.upperBound);

            return child;
          });

          for (const child of offspring) {
            if (newGeneration.length < this.population.length) {
              newGeneration.push(child);
            } else {
              break;
            }
          }
        } else {
          let randomInd =
            this.population[Math.floor(Math.random() * this.population.length)];
          newGeneration.push(randomInd);
        }
      }

      this.population = replacement(
        this.population,
        newGeneration,
        this.fitnessFunction,
        this.replacementType
      );

      generationCount++;

      // The whole engine minimises (see safe.js / replacement.js), so the
      // best individual is the one with the lowest objective value.
      const currentBest = this.population.reduce(
        (best, ind) => Math.min(best, safeObjective(this.fitnessFunction, ind)),
        Infinity
      );

      bestFitness = currentBest;
      // Non-elitist replacement can discard the best individual found so far,
      // so remember it rather than only reporting the final population.
      this.bestEver = Math.min(this.bestEver, currentBest);
      bestFitnessHistory.push(currentBest);

      if (
        stopCondition(
          this.terminationCriteria,
          generationCount,
          bestFitness,
          bestFitnessHistory,
          this.population,
          startTime,
          {
            maxGenerations: this.maxGenerations,
            fitnessThreshold: this.fitnessThreshold,
            stagnationLimit: this.stagnationLimit,
            timeLimit: this.timeLimit,
            convergenceThreshold: this.convergenceThreshold,
          }
        )
      ) {
        break;
      }
    }
  }
  top10() {
    // Sort ascending: lowest objective value first (best).
    const ranked = [...this.population].sort(
      (a, b) =>
        safeObjective(this.rawFitnessFunction, a) -
        safeObjective(this.rawFitnessFunction, b)
    );
    return ranked.slice(0, 10).map((ind) => {
      if (this.dataType === "Real Number") {
        return ind.map((gene) => gene.toFixed(2));
      }
      return ind;
    });
  }
  bestfit() {
    return this.population.reduce(
      (best, ind) =>
        Math.min(best, safeObjective(this.rawFitnessFunction, ind)),
      this.bestEver
    );
  }
}
