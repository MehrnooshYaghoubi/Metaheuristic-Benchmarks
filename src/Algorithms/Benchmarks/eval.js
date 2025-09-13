export function meanAndVariance(vec) {
  const n = vec.length;
  if (n === 0) return { mean: NaN, variance: NaN };

  // Calculate mean
  const mean = vec.reduce((acc, x) => acc + x, 0) / n;

  // Calculate variance
  const variance = vec.reduce((acc, x) => acc + (x - mean) ** 2, 0) / n;

  return { mean, variance };
}

export function toScientific(num, precision = 6, asObject = false) {
  if (typeof num !== "number" || !isFinite(num)) {
    return "-";
  }

  // Handle 0 separately
  if (num === 0) {
    return asObject ? { mantissa: 0, exponent: 0 } : "0";
  }

  // Compute exponent in base 10
  const exponent = Math.floor(Math.log10(Math.abs(num)));

  // Normalize mantissa
  const mantissa = +(num / Math.pow(10, exponent)).toPrecision(precision);

  if (asObject) {
    return { mantissa, exponent };
  }

  // Return formatted string
  return `${mantissa}×10^${exponent}`;
}
