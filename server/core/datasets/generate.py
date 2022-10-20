import pandas as pd
from faker import Faker
import random
import copy
import numpy as np
import os

#@markdown Elegimos la cantidad de observaciones a generar

#@markdown Generamos las letras
#b
letraB = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
letraD = [
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [2, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    [2, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [2, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [2, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [2, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
letraF = [
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    
]
letrasArray = [letraB, letraD, letraF]

#@markdown Esta es la parte importante del código.
#@markdown Si querés entender en detalle, está todo comentado, podes ver el código sin problema.
#@markdown > ¿Te gustaría descargar el archivo de resultados?
descargar = False #@param {type: "boolean"}
#@param {type: "integer"} #se usa 100, 500 y 1000
def generate_dataset(cantObs):
  salida = []
  fake = Faker()
  sinDist = cantObs*0.1 #10% de los conjuntos (100 500 1000)
  # Queremos que el dataset sea representativo, por lo que vamos a dividir la cantidad a generar
  # por la cantidad de letras, así tenemos la misma cantidad (o aproximadamente la misma) de cada
  # una de las letras.
  ejemplo = []
  selectorLetra = 0

  # Bucle de cantidad de observaciones
  for obs in range(0, cantObs):
    if sinDist > 0:
      distorsion = 0
      sinDist = sinDist - 1
    else:
      # Aleatorizamos la distorsión entre 1 y 30 (porque aca se hacen solo los distorcionados)
      distorsion = random.randint(1,30)

    # Elegimos las letras del array de letras en orden
    letra = copy.deepcopy(letrasArray[selectorLetra])

    #No voy a cambiar la celda 2 veces (disminuye distorsion)
    noRepetirCelda = []
    i = 1
    while i <= distorsion:
      # Bit aleatorio en X (columnas de la 1 a la 10)
      distX = random.randint(2, 11)
      # Bit aleatorio en Y (filas de la 0 a la 9)
      distY = random.randint(0, 9)
      if (distY, distX) not in noRepetirCelda:
        # Si el contenido es == 0, entonces le cargamos 1 y visceversa
        if letra[distY][distX] == 0:
          letra[distY][distX] = 1;
        
        else:
          letra[distY][distX] = 0;
        noRepetirCelda.append((distY, distX))
        i = i + 1

    #pasamos la letra en forma de matriz a una simple fila
    auxLetra = np.array(letra)
    auxLetra = auxLetra.T[2:12].T.flatten()
    letra = copy.deepcopy(letrasArray[selectorLetra][0][0])
    auxLetra = np.append([letra, distorsion], auxLetra, axis=0)
    salida.append(auxLetra);
    # Pasamos a la siguiente letra
    if selectorLetra < (len(letrasArray) - 1):
      selectorLetra = selectorLetra + 1
    else:
      selectorLetra = 0

  np.random.shuffle(salida)
  # Una vez que finalizamos el bucle, cargamos este arreglo de salida a un .csv 
  df_letras_distorsionadas = pd.DataFrame(salida);
  df_letras_distorsionadas.to_csv(rf'{os.path.dirname(__file__)}/letras_distorsionadas' + str(cantObs) + '.csv', index=False)
  return True