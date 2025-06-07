import { crossover } from "./crossover.js";
import { createPopulation } from "./initialization.js";
import { mutation } from "./mutation.js";
import { replacement } from "./replacement.js";
import { selection } from "./selection.js";
import { stopCondition } from "./stop_condition.js";

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
    convergenceThreshold = 0.001
  ) {
    this.populationSize = populationSize;
    this.mutationRate = mutationRate;
    this.crossoverRate = crossoverRate;
    this.fitnessFunction = fitnessFunction;
    this.population = [];
    this.crossoverType = crossoverType;
    this.selectionType = selectionType;
    this.terminationCriteria = terminationCriteria;
    this.dataType = dataType;
    this.mutationType = mutationType;
    this.replacementType = replacementType;
    this.geneLength = geneLength;
    this.upperBound = upperBound;
    this.lowerBound = lowerBound;
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
    let bestFitness = -Infinity;

    while (true) {
      let newGeneration = [];

      while (newGeneration.length < this.population.length) {
        if (Math.random() < this.crossoverRate) {
          let [dad, mom] = selection(
            this.population,
            this.fitnessFunction,
            this.selectionType
          );

          let offspring = crossover(this.crossoverType, dad, mom).offspring;

          offspring = offspring.map((child) =>
            Math.random() < this.mutationRate
              ? mutation(child, this.mutationRate, this.mutationType)
              : child
          );

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

      const currentBest = this.population.reduce((best, ind) => {
        const fit = this.fitnessFunction(ind);
        return fit > best ? fit : best;
      }, -Infinity);

      bestFitness = currentBest;
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

      // Let the UI update every few generations
      if (generationCount % 5 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  }
  top10() {
    let replica = this.population.map((ind) => {
      if (this.dataType === "Real Number") {
        return ind.map((gene) => gene.toFixed(2));
      } else {
        return ind;
      }
    });
    replica.sort((a, b) => {
      return this.fitnessFunction(b) - this.fitnessFunction(a);
    });
    replica = replica.slice(0, 10);
    console.log({ replica });
    return replica;
  }
  bestfit() {
    return this.population.reduce((best, ind) => {
      const fit = this.fitnessFunction(ind);
      return fit > best ? fit : best;
    }, -Infinity);
  }
}

// const gn = new Genetic(
//     100, // population size
//     0.01, // mutation rate
//     0.7, // crossover rate
//     (individual) => [...individual].reduce((sum, gene) => sum + Number(gene), 0),
//     "singlePoint", // crossover type
//     "tournament", // selection type
//     "maxGenerations", // termination criteria
//     "binary", // data type
//     "bit_flip_mutation", // mutation type
//     "elitism" // replacement type
// );

// gn.runAlgorithm();
