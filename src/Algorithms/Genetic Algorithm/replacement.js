function generationalReplacement(oldPopulation, offspring) {

    return offspring;
}

function elitismReplacement(
    oldPopulation,
    offspring,
    fitnessFunc,
    elitismCount = 1
) {

    const combinedPopulation = [...oldPopulation, ...offspring];
    combinedPopulation.sort((a, b) => fitnessFunc(b) - fitnessFunc(a));
    return combinedPopulation.slice(0, oldPopulation.length);
}

function steadyStateReplacement(oldPopulation, offspring, replacementCount) {

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

    const combinedPopulation = [...oldPopulation, ...offspring];
    combinedPopulation.sort((a, b) => fitnessFunc(b) - fitnessFunc(a));
    return combinedPopulation.slice(0, oldPopulation.length);
}

export function replacement(
    oldPopulation,
    offspring,
    fitnessFunc,
    method = "Generational",
    options = {}
) {
    switch (method) {
        case "Generational Replacement":
            return generationalReplacement(oldPopulation, offspring);
        case "Elitism":
            return elitismReplacement(
                oldPopulation,
                offspring,
                fitnessFunc,
                options.elitismCount
            );
        case "Steady State Replacement":
            return steadyStateReplacement(
                oldPopulation,
                offspring,
                options.replacementCount
            );
        case "Tournament Replacement":
            return tournamentReplacement(
                oldPopulation,
                offspring,
                fitnessFunc,
                options.tournamentSize
            );
        case "Fitness Based Replacement":
            return fitnessBasedReplacement(
                oldPopulation,
                offspring,
                fitnessFunc
            );
        default:
            throw new Error("Invalid replacement method");
    }
}
