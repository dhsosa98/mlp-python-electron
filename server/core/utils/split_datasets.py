from .one_hot import one_hot

# Cantidad de valores del patrón, 1 para la clase, 1 para la distorsión y 100 para los pixeles
n=102

# Dividimos el dataset en Entrenamiento, Validación y Test ([80%, 70%, 60%], [10%, 20%, 30%], 10%)
def splitDatasets(data, val_percentage=0.1, test=False):
    # Dividimos el dataset en el conjunto de Test
    test_percentage = 0.1
    test_limit = int(test_percentage * data[:, 1].size)
    data_test = data[0:test_limit].T
    Y_test = one_hot(data_test[0])
    X_test = data_test[2:n].T

    if test==True:
        return X_test, Y_test

    # Dividimos el dataset en el conjunto de Entrenamiento
    validation_limit = int((1 - val_percentage) * data[:, 1].size)
    data_train = data[test_limit:validation_limit].T

    Y_train = one_hot(data_train[0])
    X_train = data_train[2:n].T

    # Dividimos el dataset en el conjunto de Validación
    data_val = data[validation_limit:data[:, 1].size].T
    Y_val = one_hot(data_val[0])
    X_val = data_val[2:n].T

    return X_test, Y_test, X_train, Y_train, X_val, Y_val
