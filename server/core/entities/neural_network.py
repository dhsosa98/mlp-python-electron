import numpy as np
from .neural_layer import neural_layer
from ..utils.functions import lineal, sigm

#Aca creamos la capa de la red neuronal
class neural_network():
    def __init__(self, topology):
        self.topology = topology
        self.nn = self.create_nn()

    def create_nn(self):
        nn = []
        #Este for recorre solo hasta la ANTEULTIMA capa (osea la ultima capa oculta)
        for l, layer in enumerate(self.topology[:-1]): #100,5,3
            if l==len(self.topology) -2:
              nn.append(neural_layer(self.topology[l], self.topology[l+1], sigm))# Cuantas neuronas tiene y cuantas salidas necesita
            #cuando se recorrieron todas (arriba) lo de abajo se hace para la CAPA DE SALIDA
            else:
              nn.append(neural_layer(self.topology[l], self.topology[l+1], lineal))
              

        return nn

    def print_nn(self):
      print('Red Neuronal: ')
      for l, layer in enumerate(self.nn):
        print('Capa actual: ', l)
        print('W: ',self.nn[l].W.shape)
        print('b: ',self.nn[l].b.shape)
        print('act_f: ',self.nn[l].act_f.__name__)
    
    def get_prediction(self, model):
        return np.argmax(model, 1)

    def accuracy(self, prediction, Y):
        Y_arg = np.argmax(Y, 1)
        print('Prediction: ', prediction, 'Class: ', Y_arg)
        return (np.sum(prediction == Y_arg) / Y_arg.size)*100