import { safeObjective } from "./safe.js";

function generationalReplacement(oldPopulation, offspring) {
  return offspring;
}

function elitismReplacement(oldPopulation, offspring, objectiveFn) {
  // Build combined list, sort by objective (lower is better)
  const combined = [...oldPopulation, ...offspring];
  combined.sort((a, b) => {
    const oa = safeObjective(objectiveFn, a);
    const ob = safeObjective(objectiveFn, b);
    return oa - ob; // ascending -> lower objective first
  });
  // take top N (lowest objective)
  return combined.slice(0, oldPopulation.length);
}

function steadyStateReplacement(
  oldPopulation,
  offspring,
  replacementCount,
  objectiveFn
) {
  // Default to replacing a tenth of the population (at least one individual)
  // rather than zero -- an undefined count skipped the loop entirely, leaving
  // the population frozen and every stagnation-based stop condition stuck.
  const count = Math.min(
    offspring.length,
    replacementCount ?? Math.max(1, Math.floor(oldPopulation.length / 10))
  );

  // Replace the WORST individuals, not the first ones, so the operator
  // actually applies selection pressure.
  const order = oldPopulation
    .map((ind, i) => ({ i, obj: safeObjective(objectiveFn, ind) }))
    .sort((a, b) => b.obj - a.obj);

  const newPopulation = [...oldPopulation];
  for (let k = 0; k < count; k++) {
    newPopulation[order[k].i] = offspring[k];
  }
  return newPopulation;
}

function tournamentReplacement(
  oldPopulation,
  offspring,
  objectiveFn,
  tournamentSize = 3
) {
  const combinedPopulation = [...oldPopulation, ...offspring];
  const newPopulation = [];
  for (let i = 0; i < oldPopulation.length; i++) {
    const tournament = [];
    for (let j = 0; j < tournamentSize; j++) {
      const randomIndex = Math.floor(Math.random() * combinedPopulation.length);
      tournament.push(combinedPopulation[randomIndex]);
    }
    const winner = tournament.reduce(
      (best, individual) =>
        safeObjective(objectiveFn, individual) <
        safeObjective(objectiveFn, best)
          ? individual
          : best,
      tournament[0]
    );
    newPopulation.push(winner);
  }
  return newPopulation;
}

function fitnessBasedReplacement(oldPopulation, offspring, objectiveFn) {
  const combinedPopulation = [...oldPopulation, ...offspring];
  // Ascending: lowest objective first (we minimise).
  combinedPopulation.sort(
    (a, b) => safeObjective(objectiveFn, a) - safeObjective(objectiveFn, b)
  );
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
      return elitismReplacement(oldPopulation, offspring, fitnessFunc);
    case "Steady State Replacement":
      return steadyStateReplacement(
        oldPopulation,
        offspring,
        options.replacementCount,
        fitnessFunc
      );
    case "Tournament Replacement":
      return tournamentReplacement(
        oldPopulation,
        offspring,
        fitnessFunc,
        options.tournamentSize
      );
    case "Fitness Based Replacement":
      return fitnessBasedReplacement(oldPopulation, offspring, fitnessFunc);
    default:
      throw new Error("Invalid replacement method");
  }
}
