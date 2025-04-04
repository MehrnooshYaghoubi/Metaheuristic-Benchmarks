import random
from typing import List, Union

def create_binary_individual(gene_length: int) -> List[int]:
    """
    Create a binary individual with a specified gene length.
    Each gene is randomly chosen as 0 or 1.
    """
    return [random.randint(0, 1) for _ in range(gene_length)]

def create_real_individual(gene_length: int, lower_bound: float = -10.0, upper_bound: float = 10.0) -> List[float]:
    """
    Create a real-valued individual.
    Each gene is randomly chosen within the range [lower_bound, upper_bound].
    The formula used is: x = lower_bound + (upper_bound - lower_bound) * r
    where r is a random number between 0 and 1.
    """
    return [lower_bound + (upper_bound - lower_bound) * random.random() for _ in range(gene_length)]

def create_population(population_size: int, gene_length: int, representation: str = "binary", **kwargs) -> List[Union[List[int], List[float]]]:
    """
    Create an initial population.
    
    Parameters:
    - population_size: Number of individuals in the population.
    - gene_length: Length of each individual (number of genes).
    - representation: Type of representation ("binary" for binary and "real" for real-valued).
    - kwargs: Additional parameters for real-valued individuals (e.g., lower_bound and upper_bound).
    
    Returns:
    - A list of individuals (population).
    """
    if representation == "binary":
        return [create_binary_individual(gene_length) for _ in range(population_size)]
    elif representation == "real":
        lower_bound = kwargs.get("lower_bound", -10.0)
        upper_bound = kwargs.get("upper_bound", 10.0)
        return [create_real_individual(gene_length, lower_bound, upper_bound) for _ in range(population_size)]
    else:
        raise ValueError("Invalid representation. Only 'binary' or 'real' is allowed.")