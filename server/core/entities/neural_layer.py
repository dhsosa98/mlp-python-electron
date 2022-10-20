import numpy as np

class neural_layer(): #self, numero de conexiones q entran desde la capa anterior, cuantas neuronas hay en la capa, y la funcion de act q se ejecuta en las neuronas de esta capa
  def __init__(self, n_conn, n_neur, act_f):
    self.act_f = act_f
    self.b = np.random.uniform(-0.5, 0.5, (1, n_neur))  #parametro de bayas
    self.W = np.random.uniform(-0.5, 0.5, (n_conn, n_neur)) #para q tmb hayan valores negativos
    self.previousDeltaWeight = np.zeros((n_conn, n_neur)) #atributo que nos dará el cambio de la matriz de pesos de la iteracion anterior
    

