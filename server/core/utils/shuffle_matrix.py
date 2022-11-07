import math
import random

# Definimos la funcion para distorsionar la matriz de los patrones
def shuffle_matrix(matrix, percentage: int):
    number_of_elemets_to_change = math.floor(percentage)
    memo = []
    i = 1
    while i <= number_of_elemets_to_change:
        # Bit aleatorio en X (columnas de la 1 a la 10)
        distX = random.randint(0, 9)
        # Bit aleatorio en Y (filas de la 0 a la 9)
        distY = random.randint(0, 9)
        if (distY, distX) not in memo:
            # Si el contenido es == 0, entonces le cargamos 1 y visceversa
            if matrix[distY][distX] == 0:
                matrix[distY][distX] = 1

            else:
                matrix[distY][distX] = 0
            memo.append((distY, distX))
            i = i + 1
    return matrix