import json
import math
import random
from api.main import saved_model_A, saved_model_B, saved_model_C
import numpy as np

def shuffle(matrix, percentage:int):
    """

    :param arr: The array of booleans to shuffle
    :param percentage: Out of 100
    :return: The new array
    """
    number_of_elemets_to_change = math.floor(percentage)
    array_indexes_to_change = []
    # Make a list of the indexes to change
    for i in range(number_of_elemets_to_change):
        array_indexes_to_change.append([random.randint(0, 9), random.randint(0, 9)])
    
    for index in array_indexes_to_change:
        element = matrix[index[0]][index[1]]
        matrix[index[0]][index[1]] =  (not element)*1
    return matrix

def select_model(model):
    if model == "A":
        return saved_model_A
    elif model == "B":
        return saved_model_B
    else:
        return saved_model_C

def mlp_answer(matrix, model="A"):
    classes = {
        0: "b",
        1: "d",
        2: "f",
    }   

    matrix = np.array(matrix)
    matrix = matrix.flatten()
    matrix = np.array([matrix])

    model = select_model(model)
    model = saved_model_A.train(matrix, '', False)

    prediction = np.argmax(model, 1)
    prediction = prediction[0]
    
    return json.dumps(classes[prediction])

