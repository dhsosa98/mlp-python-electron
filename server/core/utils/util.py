import numpy as np
import pandas as pd


def one_hot(Y):
    one_hot_Y = np.zeros((Y.size, Y.max()), dtype=float)
    one_hot_Y[np.arange(Y.size), Y-1] = 1
    return one_hot_Y


def loadDatasets(path):
    return pd.read_csv(path)


def splitDatasets(data, n=102, val_percentage=0.1):
    print(data.shape)
    test_percentage = 0.1
    test_limit = int(test_percentage * data[:, 1].size)
    data_test = data[0:test_limit].T
    Y_test = one_hot(data_test[0])
    X_test = data_test[2:n].T

    validation_limit = int((1 - val_percentage) * data[:, 1].size)
    data_train = data[test_limit:validation_limit].T

    Y_train = one_hot(data_train[0])
    X_train = data_train[2:n].T

    data_val = data[validation_limit:data[:, 1].size].T
    Y_val = one_hot(data_val[0])
    X_val = data_val[2:n].T

    print(data.shape)

    return X_test, Y_test, X_train, Y_train, X_val, Y_val

# def splitIntoTrainingDataset(data, n, val_percentage):
#   m = int((1 - 0.1 - val_percentage) * data[:,1].size)
#   data = data[m:data[:,1].size].T
#   Y = one_hot(data[0])
#   X = data[2:n].T
#   return X, Y

# def splitIntoValidationDataset(data, n, val_percentage):
#   m = int(val_percentage * data[:,1].size)
#   data_et = data[m:data[:,1].size]
#   data = data[0:m].T
#   Y = one_hot(data[0])
#   X = data[2:n].T
#   return X, Y, data_et
