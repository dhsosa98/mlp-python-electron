import numpy as np

# Definimos la codificación de la clase
def one_hot(Y):
    one_hot_Y = np.zeros((Y.size, Y.max()), dtype=float)
    one_hot_Y[np.arange(Y.size), Y-1] = 1
    return one_hot_Y

# [1,2,3,2,3,1]
# [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]
# 6x3

# [1, 0, 0] -> 1 -> b
# [0, 1, 0] -> 2 -> d
# [0, 0, 1] -> 3 -> f

# [0.99, 0.51, 0.01] -> 1 -> b