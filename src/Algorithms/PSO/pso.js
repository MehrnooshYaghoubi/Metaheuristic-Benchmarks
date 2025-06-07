// Standard PSO algorithm

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function StandardPSO(
  populationSize,
  dimension,
  lowerBound,
  upperBound,
  iterations,
  fitnessFunction,
  W,
  c1,
  c2,
  setPositionState
) {
  const population = Array.from({ length: populationSize }, () => {
    return Array.from(
      { length: dimension },
      () => lowerBound + (upperBound - lowerBound) * Math.random()
    );
  });

  const velocities = Array.from({ length: populationSize }, () => {
    return Array.from({ length: dimension }, () => 0);
  });

  let gbest = population.reduce((best, individual) =>
    fitnessFunction(individual) < fitnessFunction(best) ? individual : best
  );
  const pbest = population;

  for (let i = 0; i < iterations; i++) {
    // await sleep(400); // for the matter of visualization
    const iterationPositions = population.map((particle) => ({
      x: particle[0],
      y: particle[1] || 0,
    }));
    setPositionState(iterationPositions);
    console.log(iterationPositions);

    for (let j = 0; j < populationSize; j++) {
      const fitness = fitnessFunction(population[j]);
      if (fitness < fitnessFunction(pbest[j])) {
        pbest[j] = [...population[j]];
      }

      if (fitness < fitnessFunction(gbest)) {
        gbest = [...population[j]];
      }
    }
    for (let j = 0; j < populationSize; j++) {
      for (let k = 0; k < dimension; k++) {
        const r1 = Math.random();
        const r2 = Math.random();
        velocities[j][k] =
          W * velocities[j][k] +
          c1 * r1 * (pbest[j][k] - population[j][k]) +
          c2 * r2 * (gbest[k] - population[j][k]);
        population[j][k] += velocities[j][k];
      }
    }
  }
  console.log({ gbest });
  return gbest;
}
