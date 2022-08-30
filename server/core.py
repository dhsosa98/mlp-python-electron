import math
import random


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

def mlp_answer(m):
    dic = {
        0: "b",
        1: "d",
        2: "f",
        }
    index = random.randint(0,2)
    return dic[index]

