import numpy as np
from fastapi import HTTPException
from .crud import get_savedModel

# Definimos las clases con las neuronas de salida
classes = {
    0: "b",
    1: "d",
    2: "f",
}

# Definimos la funcion para normalizar los valores de la predicción
def normalize(X_prediction):
    sum = 0
    #Ex: X_prediction -> [0.2, 0.3, 0.5] -> 1.0

    # Sumamos los valores de la predicción
    for i in range(len(X_prediction[0])):
        sum += X_prediction[0][i]

    def addClass(x, y):
        return {"class": y, "probability": round(x*100/sum, 6)}

    return list(map(addClass, X_prediction[0], classes.values()))


# Definimos la funcion para obtener la predicción de un modelo guardado y de un patrón ingresado por el usuario
def prediction(matrix, model):

    # Si no hay una matriz como entrada, creamos una matriz de 10x10 con valores 0
    if (matrix == None):
        matrix = np.zeros((10, 10))

    # Convertimos la matriz a un array np
    matrix = np.array(matrix)

    # Le damos la forma de 1x100
    matrix = matrix.flatten()
    matrix = np.array([matrix])

    # Obtenemos el modelo guardado
    model = get_savedModel(model)

    # Si el modelo no existe, lanzamos un error
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    # Obtenemos la prediccion [[0.99, 0.1, 0.0001]]
    X_prediction = model.predict(matrix, np.zeros((1, 3)))

    # Normalizamos los valores de la prediccion
    prediction_with_class = normalize(X_prediction)

    # [{class: "b", probability: 99%}, {class: "d", probability: 0.89%}, {class: "f", probability: 0.11%}]

    # Obtenemos la neurona de salida con mayor probabilidad 0, 1 o 2
    # 1x3 -> [[0.99, 0.1, 0.0001]] -> [0]
    prediction = model.get_prediction(X_prediction)

    # Obtenemos el índice de la neurona con mayor probabilidad
    class_prediction_index = prediction[0]

    # Obtenemos las otras dos clases con su probabilidad
    other_classes_with_probability = list(filter(
        lambda x: x["class"] != classes[class_prediction_index],
        prediction_with_class
    ))

    # Retornamos la clase con mayor probabilidad y las otras dos clases
    return {"class": prediction_with_class[class_prediction_index]["class"],
            "probability": prediction_with_class[class_prediction_index]["probability"],
            "other_classes": other_classes_with_probability
            }
