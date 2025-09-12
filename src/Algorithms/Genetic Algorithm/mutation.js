// ========================
// 1. Mutation for Binary Representations
// ========================

function bit_flip_mutation(individual, mutation_rate) {
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutation_rate) {
      individual[i] = individual[i] === 0 ? 1 : 0;
    }
  }
  return individual;
}

// function complementary_mutation(individual, mutation_rate, min, max) {
//   for (let i = 0; i < individual.length; i++) {
//     if (Math.random() < mutation_rate) {
//       individual[i] = min + max - individual[i];
//     }
//   }
//   return individual;
// }

function complementaryMutationAsymmetric(individual, mutationRate, min, max) {
  const midpoint = (min + max) / 2;
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutationRate) {
      individual[i] = 2 * midpoint - individual[i]; // reflect around midpoint
      // Clip to bounds:
      if (individual[i] < min) individual[i] = min;
      if (individual[i] > max) individual[i] = max;
    }
  }
  return individual;
}

function complementary_mutation(individual, mutation_rate, min, max) {
  const midpoint = (min + max) / 2;
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutation_rate) {
      individual[i] = 2 * midpoint - individual[i]; // reflect around midpoint
      // Clip to bounds:
      if (individual[i] < min) individual[i] = min;
      if (individual[i] > max) individual[i] = max;
    }
  }
  return individual;
}

function gaussian_mutation(individual, rate, stdDev = 0.1, min, max) {
  return individual.map((gene) =>
    Math.random() < rate
      ? Math.min(max, Math.max(min, gene + stdDev * (Math.random() * 2 - 1)))
      : gene
  );
}

function swap_mutation(individual, mutation_rate) {
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutation_rate) {
      const j = Math.floor(Math.random() * individual.length);
      const temp = individual[i];
      individual[i] = individual[j];
      individual[j] = temp;
    }
  }
  return individual;
}

function insert_mutation(individual, mutation_rate) {
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutation_rate) {
      let j = Math.floor(Math.random() * individual.length);

      if (j === i) continue; // skip if same index

      const elem = individual.splice(i, 1)[0]; // remove element at i
      individual.splice(j, 0, elem); // insert it at j
    }
  }
  return individual;
}

function scramble_mutation(individual, mutation_rate) {
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutation_rate) {
      let start = Math.floor(Math.random() * individual.length);
      let end = Math.floor(Math.random() * individual.length);
      if (start > end) {
        const temp = start;
        start = end;
        end = temp;
      }

      const segment = individual.slice(start, end + 1);
      const scrambled = segment.sort(() => Math.random() - 0.5);

      individual = individual
        .slice(0, start)
        .concat(scrambled)
        .concat(individual.slice(end + 1));
    }
  }
  return individual;
}

function inversion_mutation(individual, mutation_rate) {
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutation_rate) {
      let start = Math.floor(Math.random() * individual.length);
      let end = Math.floor(Math.random() * individual.length);
      if (start > end) {
        const temp = start;
        start = end;
        end = temp;
      }
      const segment = individual.slice(start, end + 1);
      segment.reverse();
      individual = individual
        .slice(0, start)
        .concat(segment)
        .concat(individual.slice(end + 1));
    }
  }
  return individual;
}

export function mutation(
  individual,
  mutation_rate,
  mutation_type = "bit_flip_mutation",
  min = -10,
  max = 10
) {
  switch (mutation_type) {
    case "Bit Flip Mutation":
      return bit_flip_mutation(individual, mutation_rate);
    case "Complementary Mutation":
      return complementary_mutation(individual, mutation_rate, min, max);
    case "Swap Mutation":
      return swap_mutation(individual, mutation_rate);
    case "Insert Mutation":
      return insert_mutation(individual, mutation_rate);
    case "Scramble Mutation":
      return scramble_mutation(individual, mutation_rate);
    case "Inversion Mutation":
      return inversion_mutation(individual, mutation_rate);
    case "Gaussian Mutation":
      return gaussian_mutation(individual, mutation_rate, 0.1, min, max);
    default:
      throw new Error("Invalid mutation type");
  }
}
