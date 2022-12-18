import pandas as pd
import random
import copy
import numpy as np
import os
from random import shuffle


letterB = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
letterD = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
letterF = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

available_letters = [{
    "letter": "b",
    "data": letterB
}, {
    "letter": "d",
    "data": letterD
}, 
{
    "letter": "f",
    "data": letterF
}, 
]

default_csv_name = 'letras_distorsionadas'


def generate_dataset(amount_datasets):
    df = []
    withoutDist = amount_datasets*0.1  # 10% de los conjuntos (100 500 1000)
    # Queremos que el dataset sea representativo, por lo que vamos a dividir la cantidad a generar
    # por la cantidad de letras, así tenemos la misma cantidad (o aproximadamente la misma) de cada
    # una de las letras.
    currentLetterIndex = 0

    # Bucle de cantidad de observaciones
    for obs in range(0, amount_datasets):
        if withoutDist > 0:
            distortion = 0
            withoutDist = withoutDist - 1
        else:
            # Aleatorizamos la distorsión entre 1 y 30 (porque aca se hacen solo los distorcionados)
            distortion = random.randint(1, 30)

        # Elegimos las letras del array de letras en orden
        currentLetter = copy.deepcopy(available_letters[currentLetterIndex]["data"])

        # No voy a cambiar la celda 2 veces (disminuye distorsion)
        memo = []
        i = 1
        while i <= distortion:
            # Bit aleatorio en X (columnas de la 1 a la 10)
            distX = random.randint(0, 9)
            # Bit aleatorio en Y (filas de la 0 a la 9)
            distY = random.randint(0, 9)
            if (distY, distX) not in memo:
                # Si el contenido es == 0, entonces le cargamos 1 y visceversa
                if currentLetter[distY][distX] == 0:
                    currentLetter[distY][distX] = 1

                else:
                    currentLetter[distY][distX] = 0
                memo.append((distY, distX))
                i = i + 1

        # pasamos la letra en forma de matriz a una simple fila
        auxLetter = np.array(currentLetter)
        auxLetter = auxLetter.flatten()
        currentLetter = currentLetterIndex + 1
        auxLetter = np.append([currentLetter, distortion], auxLetter, axis=0)
        df.append(auxLetter)
        # Pasamos a la siguiente letra
        if currentLetterIndex < (len(available_letters) - 1):
            currentLetterIndex = currentLetterIndex + 1
        else:
            currentLetterIndex = 0

    # Aleatorizamos el dataset
    np.random.shuffle(df)
    # Una vez que finalizamos el bucle, cargamos este arreglo de salida a un .csv
    df_letras_distorsionadas = pd.DataFrame(df)
    df_letras_distorsionadas.to_csv(
        rf'{os.path.dirname(__file__)}/{default_csv_name}' + str(amount_datasets) + '.csv', index=False)
    return True
