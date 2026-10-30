import { safeObjective, objectivesToFitnesses } from "./safe.js";

function random_selection(population) {
  let randomIndex = Math.floor(Math.random() * population.length);
  let randomIndex2;
  do {
    randomIndex2 = Math.floor(Math.random() * population.length);
  } while (randomIndex2 === randomIndex);
  return [population[randomIndex], population[randomIndex2]];
}
export function roulette_wheel_selection(population, objectiveFn) {
  // Map objective -> fitness (higher better), shifted over the whole
  // population so that negative objectives are ranked correctly too.
  const objectives = population.map((ind) => safeObjective(objectiveFn, ind));
  const fitnesses = objectivesToFitnesses(objectives);

  const sum = fitnesses.reduce((a, b) => a + b, 0);
  if (!isFinite(sum) || sum <= 0) {
    // fallback: pick two random distinct individuals
    const a = Math.floor(Math.random() * population.length);
    let b = Math.floor(Math.random() * population.length);
    while (b === a) b = Math.floor(Math.random() * population.length);
    return [population[a], population[b]];
  }

  function pickOne() {
    let r = Math.random() * sum;
    for (let i = 0; i < population.length; i++) {
      r -= fitnesses[i];
      if (r <= 0) return population[i];
    }
    return population[population.length - 1]; // numerical fallback
  }

  let p1 = pickOne();
  let p2 = pickOne();
  // ensure two distinct parents (optional)
  if (p1 === p2) {
    let idx = Math.floor(Math.random() * population.length);
    p2 = population[idx];
  }
  return [p1, p2];
}

function rank_based_selection(population, objectiveFn) {
  // Pair each individual with its objective value
  const individualsWithFitness = population.map((individual) => ({
    individual,
    fitness: safeObjective(objectiveFn, individual),
  }));

  // We minimise, so sort by objective DESCENDING: rank 1 is the worst
  // (highest objective) and rank N the best (lowest objective).
  individualsWithFitness.sort((a, b) => b.fitness - a.fitness);

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
    // findIndex returns -1 (not undefined) when nothing matches, so fall back
    // to the last entry explicitly.
    const found = cumulative.findIndex((p) => p >= r);
    const index = found === -1 ? cumulative.length - 1 : found;
    return ranked[index].individual;
  };

  return [pick(), pick()];
}
function tournamentSelection(population, objectiveFn, k = 3) {
  function pick() {
    let best = null;
    let bestObj = Number.POSITIVE_INFINITY;
    for (let i = 0; i < k; i++) {
      const candidate =
        population[Math.floor(Math.random() * population.length)];
      const obj = safeObjective(objectiveFn, candidate);
      if (obj < bestObj) {
        bestObj = obj;
        best = candidate;
      }
    }
    return best;
  }
  return [pick(), pick()];
}
function truncation_selection(population, objectiveFn, fitness_threshold = 0.5) {
  // Pair individuals with their objective value
  const fitness_population = population.map((ind) => ({
    individual: ind,
    fitness: safeObjective(objectiveFn, ind),
  }));

  // We minimise, so sort ascending (lowest objective is best)
  fitness_population.sort((a, b) => a.fitness - b.fitness);

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
      return tournamentSelection(population, fitness);
    case "Truncation":
      return truncation_selection(population, fitness, fitness_threshold);
    default:
      throw new Error("Invalid selection method");
  }
}
