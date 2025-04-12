function random_selection(population) {
    let randomIndex = Math.floor(Math.random() * population.length);
    let randomIndex2;
    do {
        randomIndex2 = Math.floor(Math.random() * population.length);
    } while (randomIndex2 === randomIndex);
    return [population[randomIndex], population[randomIndex2]];
}

function roulette_wheel_selection(population, fitness) {
    const fitness_of_inviduals = population.map((indivual) =>
        fitness(indivual)
    );
    const sum_of_fitness = fitness_of_inviduals.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
    );
    const probabilities = fitness_of_inviduals.map(
        (fitness) => fitness / sum_of_fitness
    );
    const cumulative_probabilities = probabilities.reduce(
        (accumulator, currentValue) => {
            const lastValue = accumulator[accumulator.length - 1];
            accumulator.push(lastValue + currentValue);
            return accumulator;
        }
    );
    const random_values = Array.from({ length: 2 }, () => Math.random());
    const selected_indices = random_values.map((random_value) =>
        cumulative_probabilities.findIndex(
            (probability) => probability >= random_value
        )
    );
    return selected_indices.map((index) => population[index]);
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
    });
    const randomValues = [Math.random(), Math.random()];
    const selectedIndices = randomValues.map((value) =>
        cumulative_rank.findIndex((rank) => rank >= value)
    );
    return selectedIndices;
}

function tournament_selection(population, fitness) {
    const tournament_size = 3;
    result = [];
    for (let i = 0; i <= 1; i++) {
        const selected_individuals = [];
        for (let i = 0; i < tournament_size; i++) {
            const random_index = Math.floor(Math.random() * population.length);
            selected_individuals.push(population[random_index]);
        }
        const best_individual = selected_individuals.reduce((best, current) => {
            if (fitness(current) > fitness(best)) {
                return fitness(current);
            }
        });
        result.push(best_individual);
    }
    return result;
}

function truncation_selection(population, fitness, fitness_threshold) {
    const sorted_population = population.sort((a, b) => {
        const fitness_a = fitness(population.indexOf(a));
        const fitness_b = fitness(population.indexOf(b));
        return fitness_a - fitness_b;
    });

    //Select the top N%
    const selected_individuals = sorted_population.slice(
        0,
        Math.floor(population.length / fitness_threshold)
    );

    // Randomly pick one from top

    const random_indices = Array.from({ length: 2 }, () =>
        Math.floor(Math.random() * selected_individuals.length)
    );

    const selected_result = random_indices.map(
        (index) => selected_individuals[index]
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
        case "random":
            return random_selection(population);
        case "roulette_wheel":
            return roulette_wheel_selection(population, fitness);
        case "rank_based":
            return rank_based_selection(population, fitness);
        case "tournament":
            return tournament_selection(population, fitness);
        case "truncation":
            return truncation_selection(population, fitness, fitness_threshold);
        default:
            throw new Error("Invalid selection method");
    }
}
