#Funciones de activacion
import numpy as np

################# Funcion de activacion sigmoide
def sigm(x, deriv=False):
        if(deriv==True):
                return x*(1 - x)
        return 1 / (1 + np.exp(-x))

################# Funcion de activacion lineal
def lineal(X, deriv=False):
        if(deriv==True):
                return 0.1
        return X*0.1

#Definimos el mean square error, error cuadratico medio
def cost(Y, X, deriv=False):
        if (deriv==True):
                return (Y - X)
        return (1/2) * np.mean(np.power(Y - X, 2))
