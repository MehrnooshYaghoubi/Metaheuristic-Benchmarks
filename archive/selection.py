import random
from typing import List, Callable




def tournament_selection(population: List[List[int]], fitness_func: Callable, tournament_size: int = 3) -> List[int]:
    """
    Tournament selection: Selects the best individual from a randomly chosen subset of the population.
    """
    tournament = random.sample(population, tournament_size)
    return max(tournament, key=fitness_func)

def roulette_wheel_selection(population: List[List[int]], fitness_func: Callable) -> List[int]:
    """
    Roulette wheel selection: Selects individuals based on their fitness proportion.
    """
    total_fitness = sum(fitness_func(ind) for ind in population)
    pick = random.uniform(0, total_fitness)
    current = 0
    for individual in population:
        current += fitness_func(individual)
        if current > pick:
            return individual
    return population[-1]  # return the last individual

def rank_selection(population: List[List[int]], fitness_func: Callable) -> List[int]:
    """
    Rank selection: Selects individuals based on their rank (not fitness value).
    """
    ranked_population = sorted(population, key=fitness_func)
    ranks = list(range(1, len(population) + 1))
    total_ranks = sum(ranks)
    pick = random.uniform(0, total_ranks)
    current = 0
    for rank, individual in zip(ranks, ranked_population):
        current += rank
        if current > pick:
            return individual
    return ranked_population[-1]  # return the last individual

def stochastic_universal_sampling(population: List[List[int]], fitness_func: Callable, num_parents: int) -> List[List[int]]:
    """
    Stochastic Universal Sampling (SUS): Selects multiple parents evenly spaced across the fitness distribution.
    """
    total_fitness = sum(fitness_func(ind) for ind in population)
    point_distance = total_fitness / num_parents
    start_point = random.uniform(0, point_distance)
    points = [start_point + i * point_distance for i in range(num_parents)]
    
    parents = []
    current = 0
    for point in points:
        while current < point:
            for individual in population:
                current += fitness_func(individual)
                if current >= point:
                    parents.append(individual)
                    break
    return parents

def random_selection(population: List[List[int]]) -> List[int]:
    """
    Random selection: Selects a parent randomly from the population.
    Every individual has an equal chance of being selected.
    """
    return random.choice(population)