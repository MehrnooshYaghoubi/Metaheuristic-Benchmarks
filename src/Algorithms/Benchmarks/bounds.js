// Normalise a bound specification into a per-dimension array.
//
// Accepts a scalar (same bound in every dimension) or an array of per-dimension
// bounds. Short arrays are padded with their last entry so that a 2-D domain
// spec is still usable if a caller asks for more dimensions.
export function toBoundArray(bound, dimension) {
  if (Array.isArray(bound)) {
    const out = new Array(dimension);
    for (let i = 0; i < dimension; i++) {
      out[i] = Number(bound[Math.min(i, bound.length - 1)]);
    }
    return out;
  }
  return new Array(dimension).fill(Number(bound));
}

// Normalise a (lower, upper) pair into per-dimension arrays, swapping any
// dimension whose bounds arrived in the wrong order.
export function normaliseBounds(lowerBound, upperBound, dimension) {
  const lo = toBoundArray(lowerBound, dimension);
  const hi = toBoundArray(upperBound, dimension);
  for (let i = 0; i < dimension; i++) {
    if (lo[i] > hi[i]) {
      const t = lo[i];
      lo[i] = hi[i];
      hi[i] = t;
    }
  }
  return { lower: lo, upper: hi };
}

export function clampToBounds(vector, lower, upper) {
  return vector.map((v, i) => Math.min(upper[i], Math.max(lower[i], v)));
}
