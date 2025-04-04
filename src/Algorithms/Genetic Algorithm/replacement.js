function generationalReplacement(oldPopulation, offspring) {
    /**
     * Replaces the entire old population with the offspring.
     */
    return offspring;
}

function elitismReplacement(
    oldPopulation,
    offspring,
    fitnessFunc,
    elitismCount = 1
) {
    /**
     * Replaces the old population with the offspring but keeps the best `elitismCount` individuals from the old population.
     */
    const combinedPopulation = [...oldPopulation, ...offspring];
    combinedPopulation.sort((a, b) => fitnessFunc(b) - fitnessFunc(a));
    return combinedPopulation.slice(0, oldPopulation.length);
}

function steadyStateReplacement(oldPopulation, offspring, replacementCount) {
    /**
     * Replaces only `replacementCount` individuals in the old population with the offspring.
     */
    const newPopulation = [...oldPopulation];
    for (let i = 0; i < replacementCount; i++) {
        if (i < offspring.length) {
            newPopulation[i] = offspring[i];
        }
    }
    return newPopulation;
}

function tournamentReplacement(
    oldPopulation,
    offspring,
    fitnessFunc,
    tournamentSize = 3
) {
    /**
     * Uses tournament selection to decide which individuals (from old population and offspring) survive to the next generation.
     */
    const combinedPopulation = [...oldPopulation, ...offspring];
    const newPopulation = [];
    for (let i = 0; i < oldPopulation.length; i++) {
        const tournament = [];
        for (let j = 0; j < tournamentSize; j++) {
            const randomIndex = Math.floor(
                Math.random() * combinedPopulation.length
            );
            tournament.push(combinedPopulation[randomIndex]);
        }
        const winner = tournament.reduce(
            (best, individual) =>
                fitnessFunc(individual) > fitnessFunc(best) ? individual : best,
            tournament[0]
        );
        newPopulation.push(winner);
    }
    return newPopulation;
}

function fitnessBasedReplacement(oldPopulation, offspring, fitnessFunc) {
    /**
     * Replaces the worst individuals in the old population with the offspring.
     */
    const combinedPopulation = [...oldPopulation, ...offspring];
    combinedPopulation.sort((a, b) => fitnessFunc(b) - fitnessFunc(a));
    return combinedPopulation.slice(0, oldPopulation.length);
}

export function replacement(
    oldPopulation,
    offspring,
    fitnessFunc,
    method = "generational",
    options = {}
) {
    switch (method) {
        case "generational":
            return generationalReplacement(oldPopulation, offspring);
        case "elitism":
            return elitismReplacement(
                oldPopulation,
                offspring,
                fitnessFunc,
                options.elitismCount
            );
        case "steady-state":
            return steadyStateReplacement(
                oldPopulation,
                offspring,
                options.replacementCount
            );
        case "tournament":
            return tournamentReplacement(
                oldPopulation,
                offspring,
                fitnessFunc,
                options.tournamentSize
            );
        case "fitness-based":
            return fitnessBasedReplacement(
                oldPopulation,
                offspring,
                fitnessFunc
            );
        default:
            throw new Error("Invalid replacement method");
    }
}
