import { meanAndVariance } from "../Benchmarks/eval.js";
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
  const population = Array.from({ length: populationSize }, () =>
    Array.from(
      { length: dimension },
      () => lowerBound + (upperBound - lowerBound) * Math.random()
    )
  );

  const velocities = Array.from({ length: populationSize }, () =>
    Array.from({ length: dimension }, () => 0)
  );

  const pbest = population.map((p) => [...p]);
  let gbest = population[0];

  let fitnessCallCount = 0;
  let gbestFitness = await fitnessFunction(gbest);
  fitnessCallCount++;

  for (let i = 1; i < population.length; i++) {
    if (fitnessCallCount >= maxFitnessCalls) break;
    const fitness = await fitnessFunction(population[i]);
    fitnessCallCount++;
    const currentBestFitness = gbestFitness; // already computed
    if (fitness < currentBestFitness) {
      gbest = [...population[i]];
      gbestFitness = fitness;
    }
  }

  let logisticState = Wseed;
  const yieldEvery = 50; // yield every 50 iterations
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

      const pbestFitness = await fitnessFunction(pbest[j]);
      fitnessCallCount++;

      if (currentFitness < pbestFitness) {
        pbest[j] = [...population[j]];

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

        velocities[j][k] =
          inertia * velocities[j][k] +
          c1 * r1 * (pbest[j][k] - population[j][k]) +
          c2 * r2 * (gbest[k] - population[j][k]);

        population[j][k] += velocities[j][k];
        population[j][k] = Math.max(
          lowerBound,
          Math.min(upperBound, population[j][k])
        );
      }
    }

    data.push({
      best: gbestFitness,
      fitnessCalls: fitnessCallCount,
    });

    setData(data);

    if (fitnessCallCount % yieldEvery === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return { gbest, bestFitness: gbestFitness, fitnessCalls: fitnessCallCount };
}

async function Benchmarks() {
  const benchmark_list = [
    bohachevskyN1,
    ackleyN2,
    sphere,
    brent,
    dropWave,
    matyas,
    schwefel220,
    bird,
    deckkersAarts,
    goldsteinPrice,
    happyCat,
    leviN13,
    salomon,
    wolfe,
  ];

  let results = {};

  for (let modal of benchmark_list) {
    for (let i = 0; i < 20; i++) {
      const result = await StandardPSO(
        50,
        30,
        -10,
        10,
        40000,
        modal,
        0.74,
        1.42,
        1.42,
        null,
        false
      );
      console.log(`unimodal: ${modal.name} result: ${result.bestFitness}`);
      if (results[modal.name] == null || results[modal.name] == undefined)
        results[modal.name] = [];
      results[modal.name].push(result.bestFitness);
    }
  }

  for (let key in results) {
    results[key] = meanAndVariance(results[key]);
  }

  await saveObjectToJSON("data.json", results);
}
