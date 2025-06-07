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
    replacementType
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
    this.geneLength = 20;
  }
  runAlgorithm() {
    this.population = createPopulation(
      this.populationSize,
      this.geneLength,
      this.dataType
    );
    let generationCount = 0;
    const startTime = Date.now();
    let bestFitnessHistory = [];
    let bestFitness = -Infinity;

    while (true) {
      let newGeneration = [];

      // Generate new population with exactly the same size
      while (newGeneration.length < this.population.length) {
        if (Math.random() < this.crossoverRate) {
          // Select parents
          let [dad, mom] = selection(
            this.population,
            this.fitnessFunction,
            this.selectionType
          );
          // Perform crossover
          let offspring = crossover(this.crossoverType, dad, mom);
          offspring = offspring.offspring;
          // Apply mutation on offspring
          offspring = offspring.map((child) => {
            return Math.random() < this.mutationRate
              ? mutation(child, this.mutationRate, this.mutationType)
              : child;
          });

          // Add offspring to newGeneration but don't exceed population size
          for (const child of offspring) {
            if (newGeneration.length < this.population.length) {
              newGeneration.push(child);
            } else {
              break;
            }
          }
        } else {
          // No crossover: copy random individual to new generation
          let randomInd =
            this.population[Math.floor(Math.random() * this.population.length)];
          newGeneration.push(randomInd);
        }
      }

      // Replace old population with new generation
      this.population = replacement(
        this.population,
        newGeneration,
        this.fitnessFunction,
        this.replacementType
      );

      generationCount++;

      console.log(
        `Generation ${generationCount}: Population Size = ${this.population.length}`
      );
      console.log(
        `Best Fitness in Generation ${generationCount}: ${bestFitness}`
      );
      console.log("Sample individual:", this.population[0]);
      console.log("Fitness:", this.fitnessFunction(this.population[0]));

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
            maxGenerations: 400,
            fitnessThreshold: 9,
            stagnationLimit: 20,
            timeLimit: 30000,
            convergenceThreshold: 1,
          }
        )
      ) {
        console.log("Stopping condition met.");
        break;
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
