import { meanAndVariance } from "../Benchmarks/eval.js";
import { normaliseBounds } from "../Benchmarks/bounds.js";
import {
  ackleyN2,
  bird,
  bohachevskyN1,
  brent,
  deckkersAarts,
  dropWave,
  goldsteinPrice,
  happyCat,
  leviN13,
  matyas,
  salomon,
  schwefel220,
  sphere,
  wolfe,
} from "../Benchmarks/main.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Logistic Chaos Map generator
function logisticMap(seed, r = 3.99, iterations = 1) {
  let x = seed;
  for (let i = 0; i < iterations; i++) {
    x = r * x * (1 - x);
  }
  return x;
}
export async function StandardPSO(
  populationSize,
  dimension,
  lowerBound,
  upperBound,
  maxFitnessCalls, // stop when fitness function is called this many times
  fitnessFunction, // async function
  W,
  c1,
  c2,
  setPositionState,
  randomW = false,
  Wseed = 0.726,
  setData = () => {} // function to set data for visualization
) {
  // Bounds may be scalars or per-dimension arrays.
  const { lower, upper } = normaliseBounds(lowerBound, upperBound, dimension);

  // Cap each component of the velocity at the width of its own dimension,
  // so a particle cannot overshoot the entire search space in one step.
  const vMax = lower.map((lo, k) => upper[k] - lo);

  const population = Array.from({ length: populationSize }, () =>
    Array.from(
      { length: dimension },
      (_, k) => lower[k] + (upper[k] - lower[k]) * Math.random()
    )
  );

  const velocities = Array.from({ length: populationSize }, () =>
    Array.from({ length: dimension }, () => 0)
  );

  const pbest = population.map((p) => [...p]);
  // Cache each particle's personal-best objective value. Re-evaluating
  // pbest[j] every iteration doubled the fitness-call cost for no reason:
  // the value only changes when pbest[j] itself is replaced.
  const pbestFitness = new Array(populationSize);

  let fitnessCallCount = 0;
  let gbest = [...population[0]];
  let gbestFitness = Infinity;

  for (let i = 0; i < population.length; i++) {
    if (fitnessCallCount >= maxFitnessCalls) break;
    const fitness = await fitnessFunction(population[i]);
    fitnessCallCount++;
    pbestFitness[i] = fitness;
    if (fitness < gbestFitness) {
      gbest = [...population[i]];
      gbestFitness = fitness;
    }
  }
  // Any particle not evaluated within the budget still needs a comparable value.
  for (let i = 0; i < populationSize; i++) {
    if (pbestFitness[i] === undefined) pbestFitness[i] = Infinity;
  }

  let logisticState = Wseed;
  const yieldEvery = 50; // publish/yield every 50 fitness calls
  let lastPublished = 0;
  let data = [];

  // Main loop continues until fitness call limit is reached
  while (fitnessCallCount < maxFitnessCalls) {
    if (setPositionState) {
      const iterationPositions = population.map((particle) => ({
        x: particle[0],
        y: particle[1] || 0,
      }));
      setPositionState(iterationPositions);
    }

    const inertiaWeights = randomW
      ? Array.from({ length: dimension }, () => {
          logisticState = logisticMap(logisticState);
          return 0.4 + 0.5 * logisticState;
        })
      : Array(dimension).fill(W);

    for (let j = 0; j < populationSize; j++) {
      if (fitnessCallCount >= maxFitnessCalls) break;

      const currentFitness = await fitnessFunction(population[j]);
      fitnessCallCount++;

      if (currentFitness < pbestFitness[j]) {
        pbest[j] = [...population[j]];
        pbestFitness[j] = currentFitness;

        if (currentFitness < gbestFitness) {
          gbest = [...population[j]];
          gbestFitness = currentFitness;
        }
      }
    }

    for (let j = 0; j < populationSize; j++) {
      for (let k = 0; k < dimension; k++) {
        const r1 = Math.random();
        const r2 = Math.random();
        const inertia = inertiaWeights[k];

        let v =
          inertia * velocities[j][k] +
          c1 * r1 * (pbest[j][k] - population[j][k]) +
          c2 * r2 * (gbest[k] - population[j][k]);

        v = Math.max(-vMax[k], Math.min(vMax[k], v));
        velocities[j][k] = v;

        population[j][k] = Math.max(
          lower[k],
          Math.min(upper[k], population[j][k] + v)
        );
      }
    }

    data.push({
      best: gbestFitness,
      fitnessCalls: fitnessCallCount,
    });

    // Hand React a NEW array, and only periodically. Passing `data` itself
    // meant the reference never changed, so React skipped every re-render and
    // the convergence chart froze a few iterations into the run.
    if (fitnessCallCount - lastPublished >= yieldEvery) {
      lastPublished = fitnessCallCount;
      setData([...data]);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  setData([...data]);

  return { gbest, bestFitness: gbestFitness, fitnessCalls: fitnessCallCount };
}
