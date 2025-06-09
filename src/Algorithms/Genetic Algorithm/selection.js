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
  const minFitness = Math.min(...fitness_of_individuals);

  // Shift fitness values to be all positive
  const shifted_fitness = fitness_of_individuals.map(
    (fit) => fit - minFitness + 1e-6
  );

  const sum_of_fitness = shifted_fitness.reduce((acc, val) => acc + val, 0);

  if (sum_of_fitness === 0) {
    // Fallback: select two random individuals
    const indices = Array.from({ length: 2 }, () =>
      Math.floor(Math.random() * population.length)
    );
    return indices.map((i) => population[i]);
  }

  // Normalize fitness into probabilities
  const probabilities = shifted_fitness.map((fit) => fit / sum_of_fitness);

  // Build cumulative distribution
  const cumulative = [];
  probabilities.reduce((acc, val, i) => {
    const next = acc + val;
    cumulative[i] = next;
    return next;
  }, 0);

  // Pick one individual based on roulette wheel
  const pick = () => {
    const r = Math.random();
    const index = cumulative.findIndex((p) => p >= r) ?? cumulative.length - 1;
    return population[index];
  };

  return [pick(), pick()];
}

function rank_based_selection(population, fitness) {
  // Pair each individual with its fitness
  const individualsWithFitness = population.map((individual) => ({
    individual,
    fitness: fitness(individual),
  }));

  // Sort by fitness ascending (rank 1 is worst)
  individualsWithFitness.sort((a, b) => a.fitness - b.fitness);

  // Assign ranks (1 for worst, N for best)
  const ranked = individualsWithFitness.map((entry, index) => ({
    individual: entry.individual,
    rank: index + 1,
  }));

  // Compute cumulative probabilities based on ranks
  const totalRank = ranked.reduce((sum, r) => sum + r.rank, 0);
  const cumulative = [];
  ranked.reduce((acc, r, i) => {
    const prob = r.rank / totalRank;
    const cumProb = acc + prob;
    cumulative[i] = cumProb;
    return cumProb;
  }, 0);

  // Selection function based on cumulative probability
  const pick = () => {
    const r = Math.random();
    const index = cumulative.findIndex((p) => p >= r) ?? cumulative.length - 1;
    return ranked[index].individual;
  };

  return [pick(), pick()];
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

function truncation_selection(population, fitness, fitness_threshold = 0.5) {
  // Pair individuals with their fitness
  const fitness_population = population.map((ind) => ({
    individual: ind,
    fitness: fitness(ind),
  }));

  // Sort by fitness descending (higher fitness is better)
  fitness_population.sort((a, b) => b.fitness - a.fitness);

  // Determine how many top individuals to keep (fitness_threshold is proportion)
  const top_n = Math.max(2, Math.floor(population.length * fitness_threshold));

  const top_individuals = fitness_population
    .slice(0, top_n)
    .map((entry) => entry.individual);

  // Select two random individuals from the top N
  const selected = Array.from({ length: 2 }, () => {
    const index = Math.floor(Math.random() * top_individuals.length);
    return top_individuals[index];
  });

  return selected;
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
