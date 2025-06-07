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
    }) {
        this.population = createPopulation(
            this.populationSize,
            geneLength,
            representation,
            { lowerBound, upperBound }
        );
        let generation = [];

        while (true) {
            generation.push(this.population);
            for (let i = 0; i < crossoverRate * this.population.length; i++) {
                const [parent1, parent2] = (this.population = selection(
                    this.population,
                    fitnessFunction,
                    selectionMethod
                ));
                const offspring = crossover(crossoverMethod, parent1, parent2);

                this.population = mutation(
                    offspring,
                    mutationMethod,
                    this.mutationRate
                );
                this.population = replacement(
                    this.population,
                    replacementMethod,
                    fitnessFunction
                );

                const stop = stopCondition(
                    generation,
                    this.population,
                    fitnessFunction,
                    this.populationSize
                );
            }

            if (stop) {
                break;
            }
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
        replacementMethod
    );
    console.log(result);
}
test();
