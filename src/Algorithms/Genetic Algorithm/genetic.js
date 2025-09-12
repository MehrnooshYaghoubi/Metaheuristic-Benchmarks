import { selection } from "./selection.js";
import { crossover } from "./crossover.js";
import { mutation } from "./mutation.js";
import { createPopulation } from "./initialization.js";
import { replacement } from "./replacement.js";
import { stopCondition } from "./stop_condition.js";
class GeneticAlgorithm {
  constructor(populationSize, mutationRate, crossoverRate) {
    this.populationSize = populationSize;
    this.mutationRate = mutationRate;
    this.crossoverRate = crossoverRate;
    this.population = [];
  }

  run({
    fitnessFunction,
    selectionMethod,
    crossoverMethod,
    mutationMethod,
    replacementMethod,
    geneLength,
    representation,
    lowerBound,
    upperBound,
    stopMethod,
    maxGenerationTreshHold = 100,
    fitnessTreshHold = 0.01,
    stagnationLimit = 0.01,
    timeLimit = 60000,
    convergenceThreshold = 0.001,
  }) {
    this.population = createPopulation(
      this.populationSize,
      geneLength,
      representation,
      { lowerBound, upperBound }
    );
    let generation = [];
    let bestFitnessHistory = [];
    const startTime = Date.now();
    while (true) {
      generation.push([...this.population]);
      let newPopulation = [];

      for (let i = 0; i < this.populationSize; i++) {
        const [parent1, parent2] = selection(
          this.population,
          fitnessFunction,
          selectionMethod
        );
        const { offspring } = crossover(crossoverMethod, parent1, parent2);

        // offspring may be array of two children
        let mutatedOffspring = offspring.map((child) =>
          mutation(child, mutationMethod, this.mutationRate)
        );

        newPopulation.push(...mutatedOffspring);
        if (newPopulation.length >= this.populationSize) break;
      }

      // Apply replacement if needed (e.g., elitism)
      this.population = replacement(
        newPopulation.slice(0, this.populationSize),
        replacementMethod,
        fitnessFunction
      );
      const bestFitness = Math.max(
        ...this.population.map((ind) => fitnessFunction(ind))
      );

      const StopConditionOptions = {
        maxGenerations: maxGenerationTreshHold,
        fitnessThreshold: fitnessTreshHold,
        stagnationLimit: stagnationLimit,
        timeLimit: timeLimit,
        convergenceThreshold: convergenceThreshold,
      };

      bestFitnessHistory.push(bestFitness);
      const stop = stopCondition(
        stopMethod,
        generation,
        bestFitness,
        bestFitnessHistory,
        this.population,
        startTime,
        StopConditionOptions
      );
      if (stop) break;
    }

    return this.population;
  }
}

function test() {
  const ga = new GeneticAlgorithm(100, 0.01, 0.7);
  const fitnessFunction = (individual) => {
    return individual.reduce((acc, gene) => acc + gene, 0);
  };
  const selectionMethod = "tournament";
  const crossoverMethod = "simple";
  const mutationMethod = "bitFlip";
  const replacementMethod = "elitism";
  const result = ga.run(
    fitnessFunction,
    selectionMethod,
    crossoverMethod,
    mutationMethod,
    replacementMethod,
    20,
    "Real Number",
    0,
    10
  );
  console.log(result);
}
test();
