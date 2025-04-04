// ================================
// 1. Crossover for Binary Numbers
// ================================
// One-point crossover for binary representations
export function onePointCrossover(parent1, parent2) {
  const point = Math.floor(Math.random() * (parent1.length - 1)) + 1;
  const child1 = [...parent1.slice(0, point), ...parent2.slice(point)];
  const child2 = [...parent2.slice(0, point), ...parent1.slice(point)];
  return {
    offspring: [child1, child2],
    point: point,
  };
}

// Two-point crossover for binary representations

export function twoPointCrossover(parent1, parent2) {
  let point1 = Math.floor(Math.random() * parent1.length);
  let point2 = Math.floor(Math.random() * (parent1.length - 1));
  if (point2 >= point1) point2++;
  else [point1, point2] = [point2, point1];

  const child1 = [
    ...parent1.slice(0, point1),
    ...parent2.slice(point1, point2),
    ...parent1.slice(point2),
  ];
  const child2 = [
    ...parent2.slice(0, point1),
    ...parent1.slice(point1, point2),
    ...parent2.slice(point2),
  ];
  return {
    offspring: [child1, child2],
    points: [point1, point2],
  };
}

// Uniform crossover for binary representations
export function uniformCrossover(parent1, parent2, crossoverRate = 0.5) {
  const child1 = [];
  const child2 = [];
  const swaps = [];

  for (let i = 0; i < parent1.length; i++) {
    if (Math.random() < crossoverRate) {
      child1.push(parent2[i]);
      child2.push(parent1[i]);
      swaps.push(i);
    } else {
      child1.push(parent1[i]);
      child2.push(parent2[i]);
    }
  }
  return {
    offspring: [child1, child2],
    swaps: swaps,
  };
}

// ==============================
// 2. Crossover for Real Numbers
// ==============================

// Simple Crossover for Real Numbers
export function simpleCrossover(parent1, parent2, alpha = 0.5) {
  const length = parent1.length;
  const point = Math.floor(Math.random() * (length - 1)) + 1;

  const child1 = [...parent1.slice(0, point)];
  const child2 = [...parent2.slice(0, point)];

  // Blend remaining genes using alpha
  for (let i = point; i < length; i++) {
    child1.push(alpha * parent1[i] + (1 - alpha) * parent2[i]);
    child2.push(alpha * parent2[i] + (1 - alpha) * parent1[i]);
  }

  return {
    offspring: [child1, child2],
  };
}

// Simple Arithmetic crossover for Real Numbers
export function simpleArithmeticCrossover(parent1, parent2, alpha = 0.5) {
  const length = parent1.length;
  const point = Math.floor(Math.random() * length);

  const child1 = [...parent1];
  const child2 = [...parent2];

  child1[point] = alpha * parent1[point] + (1 - alpha) * parent2[point];
  child2[point] = alpha * parent2[point] + (1 - alpha) * parent1[point];

  return {
    offspring: [child1, child2],
  };
}

// Whole Arithmetic crossover for Real Numbers
export function wholeArithmeticCrossover(
  parent1,
  parent2,
  { alpha = 0.5 } = {}
) {
  const length = parent1.length;

  const child1 = [];
  const child2 = [];

  for (let i = 0; i < length; i++) {
    child1.push(alpha * parent1[i] + (1 - alpha) * parent2[i]);
    child2.push(alpha * parent2[i] + (1 - alpha) * parent1[i]);
  }

  return {
    offspring: [child1, child2],
  };
}

// ==============================
// 2. Crossover for Permutation
// ==============================

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

  const fillChild = (child, parent, start, end) => {
    let startingIndex = (end + 1) % length;
    for (let i = 0; i < length - (end - start); i++) {
      const currentIndex = (startingIndex + i) % length;
      if (!child.includes(parent[currentIndex])) {
        child[startingIndex] = parent[currentIndex];
      }
    }
  };

  child1 = fillChild(child1, parent2, point1, point2);
  child2 = fillChild(child2, parent1, point1, point2);

  return {
    offspring: [child1, child2],
  };
}

export function cycleRecombination(parent1, parent2) {
  const length = parent1.length;
  const child1 = new Array(length).fill(-1);
  const child2 = new Array(length).fill(-1);
  const parent1_cycles = [];
  const parent2_cycles = [];

  let i = 0;
  while (true) {}
}
