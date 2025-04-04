import random
import numpy as np
from typing import List, Union

# ========================
# 1. Mutation for Binary Representations
# ========================

def bit_flip_mutation(individual: List[int], mutation_rate: float) -> List[int]:
    """
    Bit Flip Mutation: Flips each bit with a probability of mutation_rate.
    """
    for i in range(len(individual)):
        if random.random() < mutation_rate:
            individual[i] = 1 - individual[i]  # Flip the bit
    return individual

# ========================
# 2. Mutation for Real-Valued Representations
# ========================

def uniform_mutation(individual: List[float], mutation_rate: float, lower_bound: float, upper_bound: float) -> List[float]:
    """
    Uniform Mutation: Replaces a gene with a random value within [lower_bound, upper_bound] with probability mutation_rate.
    """
    for i in range(len(individual)):
        if random.random() < mutation_rate:
            individual[i] = lower_bound + (upper_bound - lower_bound) * random.random()
    return individual

def gaussian_mutation(individual: List[float], mutation_rate: float, mu: float = 0.0, sigma: float = 1.0) -> List[float]:
    """
    Gaussian Mutation: Adds Gaussian noise to each gene with probability mutation_rate.
    mu: Mean of the Gaussian distribution.
    sigma: Standard deviation of the Gaussian distribution.
    """
    for i in range(len(individual)):
        if random.random() < mutation_rate:
            individual[i] += random.gauss(mu, sigma)
    return individual

def non_uniform_mutation(individual: List[float], mutation_rate: float, generation: int, max_generations: int, b: float = 5.0) -> List[float]:
    """
    Non-Uniform Mutation: Reduces the magnitude of mutation as generations progress.
    b: Parameter controlling the degree of non-uniformity.
    """
    for i in range(len(individual)):
        if random.random() < mutation_rate:
            delta = (1 - random.random() ** ((1 - generation / max_generations) ** b))
            if random.random() < 0.5:
                individual[i] += delta
            else:
                individual[i] -= delta
    return individual

# ========================
# 3. Mutation for Permutation-Based Representations
# ========================

def swap_mutation(individual: List[int]) -> List[int]:
    """
    Swap Mutation: Randomly swaps two genes in the individual.
    """
    idx1, idx2 = random.sample(range(len(individual)), 2)
    individual[idx1], individual[idx2] = individual[idx2], individual[idx1]
    return individual

def scramble_mutation(individual: List[int]) -> List[int]:
    """
    Scramble Mutation: Randomly shuffles a subset of genes.
    """
    start, end = sorted(random.sample(range(len(individual)), 2))
    subset = individual[start:end]
    random.shuffle(subset)
    individual[start:end] = subset
    return individual

# def inversion_mutation(individual: List[int]) -> List[int]:
    # """
    # Inversion Mutation: Reverses the order of a subset of genes.
    # """
    # start, end = sorted(random.sample(range(len(individual)), 2)
    # subset = individual[start:end]
    # individual[start:end] = subset[::-1]
    # return individual

# ========================
# 4. Mutation Wrapper
# ========================

def mutate(
    individual: Union[List[int], List[float]],
    mutation_rate: float,
    method: str,
    **kwargs
) -> Union[List[int], List[float]]:
    """
    Wrapper function to call the appropriate mutation method.
    """
    if method == "bit_flip":
        return bit_flip_mutation(individual, mutation_rate)
    elif method == "uniform":
        return uniform_mutation(individual, mutation_rate, kwargs.get("lower_bound", -10.0), kwargs.get("upper_bound", 10.0))
    elif method == "gaussian":
        return gaussian_mutation(individual, mutation_rate, kwargs.get("mu", 0.0), kwargs.get("sigma", 1.0))
    elif method == "non_uniform":
        return non_uniform_mutation(individual, mutation_rate, kwargs.get("generation", 1), kwargs.get("max_generations", 100), kwargs.get("b", 5.0))
    elif method == "swap":
        return swap_mutation(individual)
    elif method == "scramble":
        return scramble_mutation(individual)
    elif method == "inversion":
        return inversion_mutation(individual)
    else:
        raise ValueError(f"Unknown mutation method: {method}")