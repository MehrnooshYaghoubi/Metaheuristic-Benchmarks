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
}

export function orderCrossover(parent1, parent2) {
  const length = parent1.length;

  let point1 = Math.floor(Math.random() * length);
  let point2 = Math.floor(Math.random() * length);
  if (point1 > point2) {
    [point1, point2] = [point2, point1];
  }

  let child1 = new Array(length).fill(-1);
  let child2 = new Array(length).fill(-1);

  for (let i = point1; i <= point2; i++) {
    child1[i] = parent1[i];
    child2[i] = parent2[i];
  }

  let currentIndex1 = (point2 + 1) % length;

  return {
    offspring: [child1, child2],
    crossoverPoints: [point1, point2],
  };
}
