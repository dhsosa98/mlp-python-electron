#Funciones de activacion
import numpy as np

def sigm(x, deriv=False):
        if(deriv==True):
                return x*(1-x)
        return 1 / (1 + np.e ** (-x))
# sigm = (lambda x: 1 / (1 + np.e ** (-x)),
#         lambda x: x * (1 - x)) #la segunda parte es la derivada

# lineal = (lambda x: (0.5*x+4), lambda x: (0.5))

def lineal(x, deriv=False):
        if(deriv==True):
                return 0.1
        return x*0.1

# relu = (lambda x: (np.maximum(0, x)), lambda x: 1*(x>0))

#Funcion de coste 
def cost(Yp, Yr, deriv=False):
        if(deriv==True):
                return (Yp - Yr)
        return np.mean((Yp - Yr) ** 2)
# cost = (lambda Yp, Yr: np.mean((Yp - Yr) ** 2),
#            lambda Yp, Yr: (Yp - Yr))