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
  iterations,
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
  let gbestFitness = await fitnessFunction(gbest);

  for (let i = 1; i < population.length; i++) {
    const fitness = await fitnessFunction(population[i]);
    const currentBestFitness = await fitnessFunction(gbest);
    if (fitness < currentBestFitness) {
      gbest = [...population[i]];
      gbestFitness = fitness;
    }
  }

  let logisticState = Wseed;
  const yieldEvery = 50; // yield every 50 iterations
  let data = [];
  for (let iter = 0; iter < iterations; iter++) {
    const iterationPositions = population.map((particle) => ({
      x: particle[0],
      y: particle[1] || 0,
    }));
    setPositionState(iterationPositions);

    const inertiaWeights = randomW
      ? Array.from({ length: dimension }, () => {
          logisticState = logisticMap(logisticState);
          return 0.4 + 0.5 * logisticState;
        })
      : Array(dimension).fill(W);

    for (let j = 0; j < populationSize; j++) {
      const currentFitness = await fitnessFunction(population[j]);
      const pbestFitness = await fitnessFunction(pbest[j]);
      if (currentFitness < pbestFitness) {
        pbest[j] = [...population[j]];
      }

      if (currentFitness < gbestFitness) {
        gbest = [...population[j]];
        gbestFitness = currentFitness;
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

      if (iter % yieldEvery === 0) {
        // can change frequency here
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    data.push({
      best: await fitnessFunction(gbest),
      iteration: iter + 1,
    });
    console.log(data);
    setData(data);
  }

  return { gbest, bestFitness: gbestFitness };
}
