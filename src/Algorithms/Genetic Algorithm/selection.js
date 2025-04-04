export function random_selection(population) {
  const randomIndex = Math.floor(Math.random() * population.length);
  return population[randomIndex];
}

export function proportional_selection(population, fitness) {
  const fitness_of_inviduals = population.map((indivual) => fitness(indivual));
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
  const random_value = Math.random();
  const selected_index = cumulative_probabilities.findIndex(
    (probability) => probability >= random_value
  );
  return population[selected_index];
}

export function rank_based_selection(population, fitness) {
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
  const random_value = Math.random();
  const selected_index = cumulative_rank.findIndex(
    (rank) => rank >= random_value
  );
  return population[selected_index];
}

export function tournament_selection(population, fitness) {
  const tournament_size = 3;
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
  return best_individual;
}
