import numpy as np

# Definimos la codidicación de la clase
def one_hot(Y):
    one_hot_Y = np.zeros((Y.size, Y.max()), dtype=float)
    one_hot_Y[np.arange(Y.size), Y-1] = 1
    return one_hot_Y
