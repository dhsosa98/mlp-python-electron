#Funciones de activacion
import numpy as np

################# Funcion de activacion sigmoide
def sigm(x, deriv=False):
        if(deriv==True):
                return x*(1 - x)
        return 1 / (1 + np.exp(-x))

################# Funcion de activacion lineal
def lineal(x, deriv=False):
        if(deriv==True):
                return 0.1
        return x*0.1

#Definimos el mean square error, error cuadratico medio
def cost(X, Y, deriv=False):
        if (deriv==True):
                return X - Y
        return np.mean(np.power(X - Y, 2))
