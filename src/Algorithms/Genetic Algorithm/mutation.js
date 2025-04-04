// ========================
// 1. Mutation for Binary Representations
// ========================

export function bit_flip_mutation(individual, mutation_rate) {
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutation_rate) {
      individual[i] = individual[i] === 0 ? 1 : 0; // Flip the bit
    }
  }
  return individual;
}

export function complementary_mutation(individual, mutation_rate, min, max) {
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutation_rate) {
      individual[i] = min + max - individual[i]; // Complement the value
    }
  }
  return individual;
}

export function swap_mutation(individual, mutation_rate) {
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutation_rate) {
      const j = Math.floor(Math.random() * individual.length);
      // Swap the two elements
      const temp = individual[i];
      individual[i] = individual[j];
      individual[j] = temp;
    }
  }
  return individual;
}

export function insert_mutation(individual, mutation_rate) {
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutation_rate) {
      const j = Math.floor(Math.random() * individual.length);
      if (j < i) {
        const temp = j;
        i = j;
        j = temp;
      }
      const new_slice = individual.splice(j + 1, i - j, individual[i]);
      individual =
        individual.splice(0, j) + new_slice + individual.splice(i + 1);
    }
  }
  return individual;
}

export function scramble_mutation(individual, mutation_rate) {
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutation_rate) {
      const start = Math.floor(Math.random() * individual.length);
      const end = Math.floor(Math.random() * individual.length);
      if (start > end) {
        const temp = start;
        start = end;
        end = temp;
      }
      const temp = individual.slice(start, end + 1);
      temp.sort(() => Math.random() - 0.5); // Shuffle the slice
      individual =
        individual.slice(0, start) + temp + individual.slice(end + 1);
    }
  }
  return individual;
}

export function inversion_mutation(individual, mutation_rate) {
  for (let i = 0; i < individual.length; i++) {
    if (Math.random() < mutation_rate) {
      const start = Math.floor(Math.random() * individual.length);
      const end = Math.floor(Math.random() * individual.length);
      if (start > end) {
        const temp = start;
        start = end;
        end = temp;
      }
      const temp = individual.slice(start, end + 1);
      temp.reverse(); // Reverse the slice
      individual =
        individual.slice(0, start) + temp + individual.slice(end + 1);
    }
  }
  return individual;
}
