// Create a binary individual with a specified gene length.
function createBinaryIndividual(geneLength) {
  return Array.from({ length: geneLength }, () => Math.round(Math.random()));
}
// Create a real-valued individual.
function createRealIndividual(
  geneLength,
  lowerBound = -10.0,
  upperBound = 10.0
) {
  return Array.from(
    { length: geneLength },
    () => lowerBound + (upperBound - lowerBound) * Math.random()
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
    const lowerBound = options.lowerBound || -10.0;
    const upperBound = options.upperBound || 10.0;
    return Array.from({ length: populationSize }, () =>
      createRealIndividual(geneLength, lowerBound, upperBound)
    );
  } else if (representation === "Permutation") {
    return Array.from({ length: populationSize }, () =>
      createPermutationIndividual(geneLength)
    );
  } else {
    throw new Error("Invalid representation!!!!!");
  }
}

// test
// const populationSize = 5;
// const geneLength = 15;

// const permutationPopulation = createPopulation(
//     populationSize,
//     geneLength,
//     "permutation"
// );

// console.log("Permutation-based Population:");
// permutationPopulation.forEach((individual, index) => {
//     console.log(`Individual ${index + 1}:`, individual);
// });

// console.log("\nValidation:");
// permutationPopulation.forEach((individual, index) => {
//     const isValid =
//         individual.length === geneLength &&
//         new Set(individual).size === geneLength &&
//         individual.every((gene) => gene >= 1 && gene <= geneLength);
//     console.log(`Individual ${index + 1} is ${isValid ? "valid" : "invalid"}`);
// });
