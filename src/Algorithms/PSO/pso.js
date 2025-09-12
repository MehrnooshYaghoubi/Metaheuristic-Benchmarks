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

import fs from "fs/promises";

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

  console.log("🚀 Starting benchmarks...");

  const globalStart = Date.now();

  for (let modal of benchmark_list) {
    console.log(`\n=== Running benchmark: ${modal.name} ===`);
    const modalStart = Date.now();

    // Create 20 concurrent PSO runs
    const promises = Array.from({ length: 20 }, (_, i) => {
      const runStart = Date.now();
      return StandardPSO(
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
      ).then((result) => {
        const elapsed = ((Date.now() - runStart) / 1000).toFixed(2);
        console.log(
          `🏃 Run ${i + 1}/20 for ${modal.name}: bestFitness=${
            result.bestFitness
          } (took ${elapsed}s)`
        );
        return result;
      });
    });

    // Wait for all runs to finish
    const innerResults = await Promise.all(promises);

    // Store results
    results[modal.name] = innerResults.map((r) => r.bestFitness);

    // Compute stats
    const stats = meanAndVariance(results[modal.name]);
    console.log(
      `📊 Finished ${modal.name} | Mean: ${stats.mean.toFixed(
        5
      )}, Variance: ${stats.variance.toFixed(5)}`
    );

    // Update JSON after each modal
    const jsonData = JSON.stringify(
      { ...results, [modal.name]: stats },
      null,
      2
    );
    await fs.writeFile("data.json", jsonData, "utf-8");
    console.log(`💾 Updated data.json with results for ${modal.name}`);

    const modalElapsed = ((Date.now() - modalStart) / 1000).toFixed(2);
    console.log(`⏱️  Total time for ${modal.name}: ${modalElapsed}s`);
  }

  const totalElapsed = ((Date.now() - globalStart) / 1000).toFixed(2);
  console.log(
    `\n✅ All benchmarks completed! Total elapsed time: ${totalElapsed}s`
  );
}
Benchmarks();
