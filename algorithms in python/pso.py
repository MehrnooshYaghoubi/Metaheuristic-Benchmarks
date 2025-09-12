import numpy as np
from typing import Callable, Tuple, List

def logistic_map(seed: float, r: float = 3.99, iterations: int = 1) -> float:
    """Logistic Chaos Map generator."""
    x = seed
    for _ in range(iterations):
        x = r * x * (1 - x)
    return x


def standard_pso(
    population_size: int,
    dimension: int,
    lower_bound: float,
    upper_bound: float,
    iterations: int,
    fitness_function: Callable[[np.ndarray], float],
    W: float,
    c1: float,
    c2: float,
    random_W: bool = False,
    Wseed: float = 0.726,
    set_data: Callable[[List[dict]], None] = lambda _: None,
) -> Tuple[np.ndarray, float]:
    # Initialize population and velocities
    population = np.random.uniform(
        low=lower_bound, high=upper_bound, size=(population_size, dimension)
    )
    velocities = np.zeros((population_size, dimension))

    # Initialize personal bests
    pbest = population.copy()
    pbest_fitness = np.apply_along_axis(fitness_function, 1, pbest)

    # Initialize global best
    gbest_idx = np.argmin(pbest_fitness)
    gbest = pbest[gbest_idx].copy()
    gbest_fitness = pbest_fitness[gbest_idx]

    logistic_state = Wseed
    yield_every = 50
    data = []

    for iter_num in range(iterations):
        # Update personal bests
        fitness_values = np.apply_along_axis(fitness_function, 1, population)
        better_mask = fitness_values < pbest_fitness
        pbest[better_mask] = population[better_mask]
        pbest_fitness[better_mask] = fitness_values[better_mask]

        # Update global best
        min_idx = np.argmin(fitness_values)
        if fitness_values[min_idx] < gbest_fitness:
            gbest = population[min_idx].copy()
            gbest_fitness = fitness_values[min_idx]

        # Inertia weights
        if random_W:
            inertia_weights = np.zeros(dimension)
            for k in range(dimension):
                logistic_state = logistic_map(logistic_state)
                inertia_weights[k] = 0.4 + 0.5 * logistic_state
        else:
            inertia_weights = np.full(dimension, W)

        # Update velocities and positions
        r1 = np.random.rand(population_size, dimension)
        r2 = np.random.rand(population_size, dimension)

        velocities = (
            inertia_weights * velocities
            + c1 * r1 * (pbest - population) # type: ignore
            + c2 * r2 * (gbest - population)
        )

        population += velocities
        np.clip(population, lower_bound, upper_bound, out=population)

        # Yield (every 50 iterations like in JS version)
        if iter_num % yield_every == 0:
            pass  # no-op in Python, async yield unnecessary

        # Store data for visualization
        data.append({"best": gbest_fitness, "iteration": iter_num + 1})
        set_data(data)

    return gbest, gbest_fitness

