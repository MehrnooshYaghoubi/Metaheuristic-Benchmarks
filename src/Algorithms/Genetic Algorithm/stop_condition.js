// ========================
// 1. Maximum Generations
// ========================

function maxGenerationsStop(currentGeneration, maxGenerations) {
    /**
     * Stop if the current generation exceeds the maximum allowed generations.
     */
    return currentGeneration >= maxGenerations;
}

// ========================
// 2. Fitness Threshold
// ========================

function fitnessThresholdStop(bestFitness, fitnessThreshold) {
    /**
     * Stop if the best fitness exceeds the predefined threshold.
     */
    return bestFitness >= fitnessThreshold;
}

// ========================
// 3. Stagnation
// ========================

function stagnationStop(bestFitnessHistory, stagnationLimit) {
    /**
     * Stop if the best fitness has not improved for `stagnationLimit` generations.
     */
    if (bestFitnessHistory.length < stagnationLimit) {
        return false;
    }
    return bestFitnessHistory.slice(-stagnationLimit).every(fitness => fitness === bestFitnessHistory[bestFitnessHistory.length - 1]);
}

// ========================
// 4. Time Limit
// ========================

function timeLimitStop(startTime, timeLimit) {
    /**
     * Stop if the elapsed time exceeds the time limit.
     */
    return (Date.now() - startTime) >= timeLimit;
}

// ========================
// 5. Population Convergence
// ========================

function populationConvergenceStop(population, convergenceThreshold) {
    /**
     * Stop if the population becomes too homogeneous (all individuals are very similar).
     */
    if (!population || population.length === 0) {
        return false;
    }
    const firstIndividual = population[0];
    for (const individual of population) {
        const difference = individual.reduce((sum, value, index) => sum + Math.abs(value - firstIndividual[index]), 0);
        if (difference > convergenceThreshold) {
            return false;
        }
    }
    return true;
}