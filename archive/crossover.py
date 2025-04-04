import random
from typing import List, Tuple, Union

# ================================
# 1. Crossover for Binary Numbers
# ================================

def one_point_crossover(parent1: List[int], parent2: List[int]) -> Tuple[List[int], List[int]]:
    """
    One-point crossover for binary representations.
    A single crossover point is selected, and tails are swapped.
    """
    point = random.randint(1, len(parent1) - 1)
    child1 = parent1[:point] + parent2[point:]
    child2 = parent2[:point] + parent1[point:]
    return child1, child2

def two_point_crossover(parent1: List[int], parent2: List[int]) -> Tuple[List[int], List[int]]:
    """
    Two-point crossover for binary representations.
    Two crossover points are selected, and the middle segment is swapped.
    """
    point1, point2 = sorted(random.sample(range(1, len(parent1)), 2))
    child1 = parent1[:point1] + parent2[point1:point2] + parent1[point2:]
    child2 = parent2[:point1] + parent1[point1:point2] + parent2[point2:]
    return child1, child2

def uniform_crossover(parent1: List[int], parent2: List[int], crossover_rate: float = 0.5) -> Tuple[List[int], List[int]]:
    """
    Uniform crossover for binary representations.
    Each gene is swapped with a probability of crossover_rate.
    """
    child1, child2 = [], []
    for i in range(len(parent1)):
        if random.random() < crossover_rate:
            child1.append(parent2[i])
            child2.append(parent1[i])
        else:
            child1.append(parent1[i])
            child2.append(parent2[i])
    return child1, child2

# ==============================
# 2. Crossover for Real Numbers
# ==============================

def simple_crossover(parent1: List[float], parent2: List[float]) -> Tuple[List[float], List[float]]:
    """
    Simple crossover for real numbers.
    A single crossover point is selected, and tails are swapped.
    """
    point = random.randint(1, len(parent1) - 1)
    child1 = parent1[:point] + parent2[point:]
    child2 = parent2[:point] + parent1[point:]
    return child1, child2

def simple_arithmetic_crossover(parent1: List[float], parent2: List[float], alpha: float = 0.5) -> Tuple[List[float], List[float]]:
    """
    Simple arithmetic crossover for real numbers.
    Each gene is a weighted average of the parents' genes.
    """
    child1 = [alpha * p1 + (1 - alpha) * p2 for p1, p2 in zip(parent1, parent2)]
    child2 = [alpha * p2 + (1 - alpha) * p1 for p1, p2 in zip(parent1, parent2)]
    return child1, child2

def whole_arithmetic_crossover(parent1: List[float], parent2: List[float], alpha: float = 0.5) -> Tuple[List[float], List[float]]:
    """
    Whole arithmetic crossover for real numbers.
    All genes are combined using a weighted average.
    """
    child1 = [alpha * p1 + (1 - alpha) * p2 for p1, p2 in zip(parent1, parent2)]
    child2 = [alpha * p2 + (1 - alpha) * p1 for p1, p2 in zip(parent1, parent2)]
    return child1, child2

# ============================
# 3. Crossover for Permutations
# =============================

def order_recombination(parent1: List[int], parent2: List[int]) -> Tuple[List[int], List[int]]:
    """
    Order recombination (OX) for permutation-based representations.
    A segment is copied from one parent, and the remaining genes are filled in order from the other parent.
    """
    size = len(parent1)
    point1, point2 = sorted(random.sample(range(size), 2))
    
    def create_child(p1, p2):
        child = [None] * size
        child[point1:point2] = p1[point1:point2]
        remaining = [gene for gene in p2 if gene not in child]
        idx = 0
        for i in range(size):
            if child[i] is None:
                child[i] = remaining[idx]
                idx += 1
        return child
    
    child1 = create_child(parent1, parent2)
    child2 = create_child(parent2, parent1)
    return child1, child2

def cycle_recombination(parent1: List[int], parent2: List[int]) -> Tuple[List[int], List[int]]:
    """
    Cycle recombination (CX) for permutation-based representations.
    Cycles of genes are alternated between parents.
    """
    size = len(parent1)
    child1, child2 = [None] * size, [None] * size
    idx = 0
    
    while None in child1:
        if child1[idx] is None:
            # Start a cycle
            current_idx = idx
            while child1[current_idx] is None:
                child1[current_idx] = parent1[current_idx]
                child2[current_idx] = parent2[current_idx]
                current_idx = parent1.index(parent2[current_idx])
        idx += 1
    
    return child1, child2

# ========================
# 4. Crossover Wrapper
# ========================

# def crossover(
#     parent1: Union[List[int], List[float]],
#     parent2: Union[List[int], List[float]],
#     method: str,
#     **kwargs
# ) -> Tuple[Union[List[int], List[float]], Union[List[int], List[float]]]:
#     """
#     Wrapper function to call the appropriate crossover method.
#     """
#     if method == "one_point":
#         return one_point_crossover(parent1, parent2)
#     elif method == "two_point":
#         return two_point_crossover(parent1, parent2)
#     elif method == "uniform":
#         return uniform_crossover(parent1, parent2, kwargs.get("crossover_rate", 0.5))
#     elif method == "simple":
#         return simple_crossover(parent1, parent2)
#     elif method == "simple_arithmetic":
#         return simple_arithmetic_crossover(parent1, parent2, kwargs.get("alpha", 0.5))
#     elif method == "whole_arithmetic":
#         return whole_arithmetic_crossover(parent1, parent2, kwargs.get("alpha", 0.5))
#     elif method == "order":
#         return order_recombination(parent1, parent2)
#     elif method == "cycle":
#         return cycle_recombination(parent1, parent2)
#     else:
#         raise ValueError(f"Unknown crossover method: {method}")