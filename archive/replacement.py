import random
from typing import List, Callable

# ========================
# 1. Generational Replacement
# ========================

def generational_replacement(old_population: List, offspring: List) -> List:
    """
    Replaces the entire old population with the offspring.
    """
    return offspring

# ========================
# 2. Elitism
# ========================

def elitism_replacement(old_population: List, offspring: List, fitness_func: Callable, elitism_count: int = 1) -> List:
    """
    Replaces the old population with the offspring but keeps the best `elitism_count` individuals from the old population.
    """
    combined_population = old_population + offspring
    combined_population.sort(key=fitness_func, reverse=True)
    return combined_population[:len(old_population)]

# ========================
# 3. Steady-State Replacement
# ========================

def steady_state_replacement(old_population: List, offspring: List, replacement_count: int) -> List:
    """
    Replaces only `replacement_count` individuals in the old population with the offspring.
    """
    new_population = old_population.copy()
    for i in range(replacement_count):
        if i < len(offspring):  # Ensure we don't exceed the offspring list
            new_population[i] = offspring[i]
    return new_population

# ========================
# 4. Tournament Replacement
# ========================

def tournament_replacement(old_population: List, offspring: List, fitness_func: Callable, tournament_size: int = 3) -> List:
    """
    Uses tournament selection to decide which individuals (from old population and offspring) survive to the next generation.
    """
    combined_population = old_population + offspring
    new_population = []
    for _ in range(len(old_population)):
        tournament = random.sample(combined_population, tournament_size)
        winner = max(tournament, key=fitness_func)
        new_population.append(winner)
    return new_population

# ========================
# 5. Fitness-Based Replacement
# ========================

def fitness_based_replacement(old_population: List, offspring: List, fitness_func: Callable) -> List:
    """
    Replaces the worst individuals in the old population with the offspring.
    """
    combined_population = old_population + offspring
    combined_population.sort(key=fitness_func, reverse=True)
    return combined_population[:len(old_population)]

# ========================
# 6. Replacement Wrapper
# ========================

def replace(
    old_population: List,
    offspring: List,
    method: str,
    fitness_func: Callable = None,
    **kwargs
) -> List:
    """
    Wrapper function to call the appropriate replacement method.
    """
    if method == "generational":
        return generational_replacement(old_population, offspring)
    elif method == "elitism":
        return elitism_replacement(old_population, offspring, fitness_func, kwargs.get("elitism_count", 1))
    elif method == "steady_state":
        return steady_state_replacement(old_population, offspring, kwargs.get("replacement_count", 1))
    elif method == "tournament":
        return tournament_replacement(old_population, offspring, fitness_func, kwargs.get("tournament_size", 3))
    elif method == "fitness_based":
        return fitness_based_replacement(old_population, offspring, fitness_func)
    else:
        raise ValueError(f"Unknown replacement method: {method}")