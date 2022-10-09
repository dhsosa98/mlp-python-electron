import numpy as np
from .neural_layer import neural_layer

class neural_network():
    def __init__(self, topology, act_f):
        self.topology = topology
        self.nn = self.create_nn(act_f)

    def create_nn(self, act_f):
        nn = []
        for l, layer in enumerate(self.topology[:-1]):
            # if l==0:
            #   nn.append(neural_layer(topology[l], topology[l+1], lineal)) # Cuantas neuronas tiene y cuantas salidas necesita
            # else:
            #   nn.append(neural_layer(topology[l], topology[l+1], sigm))
            nn.append(neural_layer(self.topology[l], self.topology[l+1], act_f))

        return nn
    
    def get_prediction(self, model):
        return np.argmax(model, 1)

    def accuracy(self, prediction, Y):
        Y_arg = np.argmax(Y, 1)
        print('Prediction: ', prediction, 'Class: ', Y_arg)
        return (np.sum(prediction == Y_arg) / Y_arg.size)*100