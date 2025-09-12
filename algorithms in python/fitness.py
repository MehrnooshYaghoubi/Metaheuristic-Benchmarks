import numpy as np

def sum_of_squares(x: np.ndarray) -> float:
    """Sum of squares fitness function (minimized at 0 vector)."""
    return np.sum(x ** 2)