import { selection } from "./selection";
import { crossover } from "./crossover";
import { mutation } from "./mutation";
import { createPopulation } from "./initialization";
import { replacement } from "./replacement";

class GeneticAlgorithm {
    constructor(populationSize, mutationRate, crossoverRate) {
        this.populationSize = populationSize;
        this.mutationRate = mutationRate;
        this.crossoverRate = crossoverRate;
        this.population = [];
    }

    run(
        fitnessFunction,
        selectionMethod,
        crossoverMethod,
        mutationMethod,
        replacementMethod
    ) {
        this.evaluateFitness(fitnessFunction);
        const parents = this.selectParents(selectionMethod);
        const offspring = [];
        for (let i = 0; i < parents.length; i += 2) {
            if (Math.random() < this.crossoverRate) {
                const [child1, child2] = this.crossover(
                    parents[i],
                    parents[i + 1],
                    crossoverMethod
                );
                offspring.push(child1, child2);
            } else {
                offspring.push(parents[i], parents[i + 1]);
            }
        }
        offspring.forEach((individual) => {
            if (Math.random() < this.mutationRate) {
                this.mutate(individual, mutationMethod);
            }
        });
        this.population = this.replacePopulation(replacementMethod);
    }
}
