// Standard PSO algorithm

function StandardPSO(populationSize, dimension, lowerBound, upperBound, iterations, fitnessFunction, W, c1, c2) {
    // Initialize the population and velocities
    const population = Array.from({ length: populationSize }, () => {
        return Array.from({ length: dimension }, () => lowerBound + (upperBound - lowerBound) * Math.random());
    });
        
    const velocities = Array.from({ length: populationSize }, () => {
        return Array.from({ length: dimension }, () => 0)
    });

    // Initialize the personal best positions and global best position
    let gbest = population.reduce((best, individual) => 
        fitnessFunction(individual) < fitnessFunction(best) ? individual : best
    );
    const pbest = population;
    for (let i=0 ; i<iterations; i++){
        for (let j = 0; j < populationSize; j++) {
            const fitness = fitnessFunction(population[j]); // Update the personal best position
            if (fitness < pbest[j]) {
                pbest[j] = population[j];
            }
            
            if (fitness < gbest) {  // Update the global best position
                gbest = fitness;
            }
        }
        for (let j = 0; j<populationSize; j++){
            for (let k = 0; k<dimension; k++){
                const r1 = Math.random();
                const r2 = Math.random();
                velocities[j][k] = W * velocities[j][k] + c1 * r1 * (pbest[j][k] - population[j][k]) + c2* r2 * (gbest[k] - population[j][k]);
                population[j][k] += velocities[j][k];
            }
        }
    }
    return gbest;

}

