from .one_hot import one_hot
import numpy as np

# Cantidad de valores del patrón, 1 para la clase, 1 para la distorsión y 100 para los pixeles
n=102

# Dividimos el dataset en Entrenamiento, Validación y Test ([80%, 70%, 60%], [10%, 20%, 30%], 10%)
def splitDatasets(data, val_percentage=0.1, test=False, shuffle=False):
    
    if test==True:
        tCount = int(0.1 * data[:, 1].size)
        test_data = data[0:tCount].T 
        Y_test = test_data[0] 
        Y_test = Y_test[:,np.newaxis] 
        Y_test = Y_test.T
        Y_test = one_hot(Y_test) 
        X_test = test_data[2: n].T 
        return X_test, Y_test

    else:
        #Test
        tCount = int(0.1 * data[:, 1].size)
        test_data = data[0:tCount].T 
        Y_test = test_data[0] 
        Y_test = Y_test[:,np.newaxis] 
        Y_test = Y_test.T
        Y_test = one_hot(Y_test) 
        X_test = test_data[2: n].T 

        #Validation
        vCount = int(val_percentage * data[:, 1].size)
        val_data = data[tCount:tCount+vCount].T 
        Y_val = val_data[0] 
        Y_val = Y_val[:,np.newaxis] 
        Y_val = Y_val.T
        Y_val = one_hot(Y_val) 
        X_val = val_data[2: n].T 

        #Train
        train_data = data[tCount+vCount:data[:, 1].size].T 
        Y_train = train_data[0] 
        Y_train = Y_train[:,np.newaxis] 
        Y_train = Y_train.T
        Y_train = one_hot(Y_train) 
        X_train = train_data[2: n].T 
        return X_test, Y_test, X_train, Y_train, X_val, Y_val