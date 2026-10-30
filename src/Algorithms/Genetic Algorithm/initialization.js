import { normaliseBounds } from "../Benchmarks/bounds.js";

// Create a binary individual with a specified gene length.
function createBinaryIndividual(geneLength) {
  return Array.from({ length: geneLength }, () => Math.round(Math.random()));
}
// Create a real-valued individual. `lower`/`upper` are per-gene arrays.
function createRealIndividual(geneLength, lower, upper) {
  return Array.from(
    { length: geneLength },
    (_, i) => lower[i] + (upper[i] - lower[i]) * Math.random()
  );
}

// Create a permutation-based individual
function createPermutationIndividual(geneLength) {
  const individual = Array.from({ length: geneLength }, (_, i) => i);
  for (let i = geneLength - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [individual[i], individual[j]] = [individual[j], individual[i]];
  }
  return individual;
}

// Create an initial population.
export function createPopulation(
  populationSize,
  geneLength,
  representation,
  options = {}
) {
  if (representation === "Binary") {
    return Array.from({ length: populationSize }, () =>
      createBinaryIndividual(geneLength)
    );
  } else if (representation === "Real Number") {
    // Use ?? so that an explicit bound of 0 is respected. Bounds may be a
    // scalar or a per-gene array; normaliseBounds handles both.
    const { lower, upper } = normaliseBounds(
      options.lowerBound ?? -10.0,
      options.upperBound ?? 10.0,
      geneLength
    );
    return Array.from({ length: populationSize }, () =>
      createRealIndividual(geneLength, lower, upper)
    );
  } else if (representation === "Permutation") {
    return Array.from({ length: populationSize }, () =>
      createPermutationIndividual(geneLength)
    );
  } else {
    throw new Error("Invalid representation!!!!!");
  }
}
