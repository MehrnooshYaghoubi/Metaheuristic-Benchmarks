function random_selection(population) {
    let randomIndex = Math.floor(Math.random() * population.length);
    let randomIndex2;
    do {
        randomIndex2 = Math.floor(Math.random() * population.length);
    } while (randomIndex2 === randomIndex);
    return [population[randomIndex], population[randomIndex2]];
}


function roulette_wheel_selection(population, fitness) {
    const fitness_of_individuals = population.map(fitness);
    const sum_of_fitness = fitness_of_individuals.reduce((acc, val) => acc + val, 0);

    // Handle degenerate population with 0 fitness
    if (sum_of_fitness === 0) {
        // Fall back to random selection
        const random_indices = Array.from({ length: 2 }, () =>
            Math.floor(Math.random() * population.length)
        );
        return random_indices.map(index => population[index]);
    }

    const probabilities = fitness_of_individuals.map(fit => fit / sum_of_fitness);

    const cumulative_probabilities = probabilities.reduce(
        (acc, currentValue, index) => {
            const lastValue = acc[acc.length - 1];
            const nextValue = lastValue + currentValue;
            acc.push(index === probabilities.length - 1 ? 1 : nextValue);
            return acc;
        },
        [0]
    );

    const random_values = Array.from({ length: 2 }, () => Math.random());

    const selected_indices = random_values.map(random_value => {
        const index = cumulative_probabilities.findIndex(p => p >= random_value) - 1;
        return index === -1 ? population.length - 1 : index; // Safety fallback
    });


    return selected_indices.map(index => population[index]);
}   

function rank_based_selection(population, fitness) {
    const fitness_of_individuals = population.map((individual) =>
        fitness(individual)
    );
    const sorted_population = population.sort((a, b) => {
        const fitness_a = fitness_of_individuals[population.indexOf(a)];
        const fitness_b = fitness_of_individuals[population.indexOf(b)];
        return fitness_a - fitness_b;
    });

    const rank = sorted_population.map((individual, index) => ({
        individual,
        rank: index + 1,
    }));

    const cumulative_rank = rank.reduce((accumulator, currentValue) => {
        const lastValue = accumulator[accumulator.length - 1];
        accumulator.push(lastValue + currentValue.rank);
        return accumulator;
    }, [0]);
    const randomValues = [Math.random(), Math.random()];
    const selectedIndices = randomValues.map((value) =>
        cumulative_rank.findIndex((rank) => rank >= value) - 1
    );
    return selectedIndices.map(index => population[index]);
}

function tournament_selection(population, fitness) {
    const tournament_size = 3;
    let result = [];
    for (let i = 0; i <= 1; i++) {
        const selected_individuals = [];
        for (let j = 0; j < tournament_size; j++) {
            const random_index = Math.floor(Math.random() * population.length);
            selected_individuals.push(population[random_index]);
        }

        const best_individual = selected_individuals.reduce((best, current) => {
            return fitness(current) > fitness(best) ? current : best;
        });

        result.push(best_individual);
    }
    return result;
}

function truncation_selection(population, fitness, fitness_threshold) {
    // Create an array of [individual, fitness_value]
    const fitness_population = population.map(ind => [ind, fitness(ind)]);

    // Sort by fitness (assuming higher fitness is better)
    fitness_population.sort((a, b) => b[1] - a[1]);

    // Select the top N%
    const top_n = Math.floor(population.length / fitness_threshold);
    const selected_individuals = fitness_population
        .slice(0, top_n)
        .map(pair => pair[0]); // extract only individuals

    // Randomly pick 2 from top N%
    const selected_result = Array.from({ length: 2 }, () =>
        selected_individuals[Math.floor(Math.random() * selected_individuals.length)]
    );

    return selected_result;
}

export function selection(
    population,
    fitness,
    selection_method = "random",
    fitness_threshold = 0.5
) {
    switch (selection_method) {
        case "Random":
            return random_selection(population);
        case "Roulette Wheel":
            return roulette_wheel_selection(population, fitness);
        case "Rank Base":
            return rank_based_selection(population, fitness);
        case "Tournament":
            return tournament_selection(population, fitness);
        case "Truncation":
            return truncation_selection(population, fitness, fitness_threshold);
        default:
            throw new Error("Invalid selection method");
    }
}
