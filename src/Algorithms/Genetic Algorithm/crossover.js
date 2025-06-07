// ================================
// 1. Crossover for Binary Numbers
// ================================
// One-point crossover for binary representations
function singlePointCrossover(parent1, parent2) {
  const point = Math.floor(Math.random() * (parent1.length - 1)) + 1;
  const child1 = [...parent1.slice(0, point), ...parent2.slice(point)];
  const child2 = [...parent2.slice(0, point), ...parent1.slice(point)];
  return {
    offspring: [child1, child2],
    point: point,
  };
}

// Two-point crossover for binary representations

function twoPointCrossover(parent1, parent2) {
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
function uniformCrossover(parent1, parent2, crossoverRate = 0.5) {
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
function simpleCrossover(parent1, parent2, alpha = 0.5) {
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
function simpleArithmeticCrossover(parent1, parent2, alpha = 0.5) {
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
function wholeArithmeticCrossover(parent1, parent2, { alpha = 0.5 } = {}) {
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

function orderCrossover(parent1, parent2) {
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
    const length = child.length;
    let startingIndex = (end + 1) % length;
    let currentIndex = startingIndex;
    let i = 0;

    while (i < length) {
      const gene = parent[(startingIndex + i) % length];
      if (!child.includes(gene)) {
        child[currentIndex] = gene;
        currentIndex = (currentIndex + 1) % length;
      }
      i++;
    }

    return child;
  };

  child1 = fillChild(child1, parent2, point1, point2);
  child2 = fillChild(child2, parent1, point1, point2);

  return {
    offspring: [child1, child2],
  };
}

function cycleRecombination(parent1, parent2) {
  const length = parent1.length;
  const child1 = new Array(length).fill(-1);
  const child2 = new Array(length).fill(-1);

  let cycles = [];
  let assignedIndices = new Set();

  while (assignedIndices.size < length) {
    // Find the first unvisited index
    let startIndex = [...Array(length).keys()].find(
      (i) => !assignedIndices.has(i)
    );

    let cycleIndices = [];
    let currentIndex = startIndex;

    do {
      cycleIndices.push(currentIndex);
      assignedIndices.add(currentIndex);
      const valueInParent2 = parent2[currentIndex];
      currentIndex = parent1.indexOf(valueInParent2);
    } while (currentIndex !== startIndex);

    cycles.push(cycleIndices);
  }

  // Assign genes to children based on cycle parity
  cycles.forEach((cycle, index) => {
    if (index % 2 === 0) {
      // Even cycles: child1 takes genes from parent1, child2 from parent2
      for (const idx of cycle) {
        child1[idx] = parent1[idx];
        child2[idx] = parent2[idx];
      }
    } else {
      // Odd cycles: child1 takes genes from parent2, child2 from parent1
      for (const idx of cycle) {
        child1[idx] = parent2[idx];
        child2[idx] = parent1[idx];
      }
    }
  });

  return {
    offspring: [child1, child2],
  };
}

export function crossover(method, parent1, parent2) {
  switch (method) {
    case "Single Point":
      return singlePointCrossover(parent1, parent2);
    case "Two Point":
      return twoPointCrossover(parent1, parent2);
    case "Uniform":
      return uniformCrossover(parent1, parent2);
    case "Simple Crossover":
      return simpleCrossover(parent1, parent2);
    case "Simple Arithmetic Crossover":
      return simpleArithmeticCrossover(parent1, parent2);
    case "Whole Arithmetic Crossover":
      return wholeArithmeticCrossover(parent1, parent2);
    case "Order Crossover":
      return orderCrossover(parent1, parent2);
    case "Cycle Recombination":
      return cycleRecombination(parent1, parent2);
    default:
      throw new Error("Invalid crossover method");
  }
}
