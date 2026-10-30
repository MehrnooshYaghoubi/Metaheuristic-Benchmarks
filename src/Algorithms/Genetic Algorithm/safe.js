export function safeObjective(objFn, individual) {
  try {
    // Length 1 is valid: forrester and gramacyLee are 1-D benchmarks.
    if (!Array.isArray(individual) || individual.length < 1) {
      return Number.POSITIVE_INFINITY;
    }
    const x = objFn(individual);
    if (!isFinite(x)) return Number.POSITIVE_INFINITY;
    return x;
  } catch (e) {
    return Number.POSITIVE_INFINITY;
  }
}

// Convert a population's objective values (lower better) into selection
// fitnesses (higher better, strictly positive).
//
// The transform is shifted by the population's own worst finite value, so it
// works for objectives that are negative or arbitrarily large. A per-value
// 1/(1+obj) transform cannot do this: every negative objective clamps to the
// same fitness of 1, which turns roulette-wheel selection into uniform random
// picking on functions such as ackleyN2 or styblinskiTank.
export function objectivesToFitnesses(objectives, eps = 1e-12) {
  const finite = objectives.filter((o) => isFinite(o));
  if (finite.length === 0) return objectives.map(() => eps);

  const worst = Math.max(...finite);
  const best = Math.min(...finite);
  const span = worst - best;

  // All individuals equal => uniform, non-zero fitness.
  if (span <= eps) return objectives.map((o) => (isFinite(o) ? 1 : eps));

  return objectives.map((o) => {
    if (!isFinite(o)) return eps;
    // Linear rescale into (0, 1]: best -> 1, worst -> eps.
    return Math.max(eps, (worst - o) / span);
  });
}
