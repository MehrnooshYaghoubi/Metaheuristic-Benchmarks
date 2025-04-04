from typing import List, Callable
import time

# ========================
# 1. Maximum Generations
# ========================

def max_generations_stop(current_generation: int, max_generations: int) -> bool:
    """
    Stop if the current generation exceeds the maximum allowed generations.
    """
    return current_generation >= max_generations

# ========================
# 2. Fitness Threshold
# ========================

def fitness_threshold_stop(best_fitness: float, fitness_threshold: float) -> bool:
    """
    Stop if the best fitness exceeds the predefined threshold.
    """
    return best_fitness >= fitness_threshold

# ========================
# 3. Stagnation
# ========================

def stagnation_stop(best_fitness_history: List[float], stagnation_limit: int) -> bool:
    """
    Stop if the best fitness has not improved for `stagnation_limit` generations.
    """
    if len(best_fitness_history) < stagnation_limit:
        return False
    return all(best_fitness_history[-1] == x for x in best_fitness_history[-stagnation_limit:])

# ========================
# 4. Time Limit
# ========================

def time_limit_stop(start_time: float, time_limit: float) -> bool:
    """
    Stop if the elapsed time exceeds the time limit.
    """
    return time.time() - start_time >= time_limit

# ========================
# 5. Population Convergence
# ========================

def population_convergence_stop(population: List, convergence_threshold: float) -> bool:
    """
    Stop if the population becomes too homogeneous (all individuals are very similar).
    """
    if not population:
        return False
    first_individual = population[0]
    for individual in population:
        if sum(abs(x - y) for x, y in zip(first_individual, individual)) > convergence_threshold:
            return False
    return True

# ========================
# 6. Stopping Conditions Wrapper
# ========================

def should_stop(
    current_generation: int = None,
    max_generations: int = None,
    best_fitness: float = None,
    fitness_threshold: float = None,
    best_fitness_history: List[float] = None,
    stagnation_limit: int = None,
    start_time: float = None,
    time_limit: float = None,
    population: List = None,
    convergence_threshold: float = None,
) -> bool:
    """
    Wrapper function to check multiple stopping conditions.
    """
    if max_generations is not None and current_generation is not None:
        if max_generations_stop(current_generation, max_generations):
            return True

    if fitness_threshold is not None and best_fitness is not None:
        if fitness_threshold_stop(best_fitness, fitness_threshold):
            return True

    if stagnation_limit is not None and best_fitness_history is not None:
        if stagnation_stop(best_fitness_history, stagnation_limit):
            return True

    if time_limit is not None and start_time is not None:
        if time_limit_stop(start_time, time_limit):
            return True

    if convergence_threshold is not None and population is not None:
        if population_convergence_stop(population, convergence_threshold):
            return True

    return False