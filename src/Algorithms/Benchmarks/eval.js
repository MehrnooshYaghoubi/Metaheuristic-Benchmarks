export function meanAndVariance(vec) {
  const n = vec.length;
  if (n === 0) return { mean: NaN, variance: NaN };

  // Calculate mean
  const mean = vec.reduce((acc, x) => acc + x, 0) / n;

  // Calculate variance
  const variance = vec.reduce((acc, x) => acc + (x - mean) ** 2, 0) / n;

  return { mean, variance };
}
