export function safeObjective(objFn, individual) {
  try {
    if (!Array.isArray(individual) || individual.length < 2) {
      return Number.POSITIVE_INFINITY;
    }
    const x = objFn(individual);
    if (!isFinite(x)) return Number.POSITIVE_INFINITY;
    return x;
  } catch (e) {
    return Number.POSITIVE_INFINITY;
  }
}

// Convert objective (lower better) to fitness (higher better)
export function objectiveToFitness(objectiveValue, eps = 1e-12) {
  // Use a robust transform: fitness = 1 / (1 + objective - minObserved)
  // but since we might not know minObserved globally here, use 1/(1+obj)
  // This keeps fitness in (0, 1] and avoids division by zero.
  if (!isFinite(objectiveValue) || objectiveValue < 0) {
    // If negative values occur, shift them safely
    objectiveValue = Math.max(objectiveValue, -1e6);
  }
  return 1 / (1 + Math.max(0, objectiveValue)); // small obj => fitness ≈1; large obj => ≈0
}
