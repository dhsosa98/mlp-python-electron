import dill
import os
from http.client import HTTPException
import math
import random
import numpy as np


def shuffle(matrix, percentage: int):
    number_of_elemets_to_change = math.floor(percentage)
    array_indexes_to_change = []
    i = 1
    while i <= number_of_elemets_to_change:
        # Bit aleatorio en X (columnas de la 1 a la 10)
        distX = random.randint(0, 9)
        # Bit aleatorio en Y (filas de la 0 a la 9)
        distY = random.randint(0, 9)
        if (distY, distX) not in array_indexes_to_change:
            # Si el contenido es == 0, entonces le cargamos 1 y visceversa
            if matrix[distY][distX] == 0:
                matrix[distY][distX] = 1

            else:
                matrix[distY][distX] = 0
            array_indexes_to_change.append((distY, distX))
            i = i + 1
    return matrix


def select_model(model):
    return get_savedModel(model)


def mlp_answer(matrix, model="A"):
    classes = {
        0: "b",
        1: "d",
        2: "f",
    }

    if (matrix == None):
        matrix = np.zeros((10, 10))

    matrix = np.array(matrix)
    matrix = matrix.flatten()
    matrix = np.array([matrix])

    model = select_model(model)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    model = model.predict(matrix, np.zeros((1, 3)))

    def addClass(x, y):
        return {"class": y, "probability": round(x*100, 2)}

    model_with_probs = list(map(addClass, model[0], classes.values()))

    print(model_with_probs)

    prediction = np.argmax(model, 1)

    class_prediction = prediction[0]

    print(classes[class_prediction])

    other_classes = list(filter(
        lambda x: x["class"] != classes[class_prediction],
        model_with_probs
    ))

    print(other_classes)

    # print(prediction)

    return {"class": classes[class_prediction],
            "probability": model_with_probs[class_prediction]["probability"],
            "other_classes": other_classes
            }


dirname = os.path.dirname(__file__)+'/../models/saves/'


def get_savedModel(name):
    outfileN = os.path.join(dirname, './'+name)

    if os.path.isfile(outfileN):
        with open(outfileN, 'rb') as pickle_file:
            saved_model_N = dill.load(pickle_file)
            return saved_model_N
    return None


def get_savedModelAttr(model_name):
    outfile = os.path.join(dirname, './'+model_name)
    if os.path.isfile(outfile):
        if model_name.endswith(".pickle"):
            atrr = model_name.split('.pickle')[0]
            atrr = atrr.split(',')
            atrr = {
                'model_name': atrr[0],
                'lr': float(atrr[1]) if len(atrr) > 1 else None,
                'momentum': float(atrr[2]) if len(atrr) > 2 else None,
                'epoch': int(atrr[3]) if len(atrr) > 3 else None,
                'topology': list(map(int, atrr[4].split('; '))) if len(atrr) > 4 else None,
                'val_percentage': float(atrr[5]) if len(atrr) > 5 else None,
            }
            return atrr
    return None


def list_savedModels():
    saved_models = []
    for file in os.listdir(dirname):
        if file.endswith(".pickle"):

            saved_models.append(file)
    return saved_models


def delete_savedModel(name):
    outfileN = os.path.join(dirname, './'+name)
    if os.path.isfile(outfileN):
        os.remove(outfileN)
        return True
    return False
