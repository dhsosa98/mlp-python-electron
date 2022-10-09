import numpy as np
#Definimos el algoritmo de entrenamiento
class Model():
  def __init__(self, neural_net, cost_function, lr, m):
    self.neural_net = neural_net
    self.cost_function = cost_function
    self.lr = lr
    self.m = m
    self.deltas = []
    self.out = [(None, None)]

  def gradient_descent(self, l):
    self.neural_net[l].b = self.neural_net[l].b - np.mean(self.deltas[0], axis=0, keepdims=True) * self.lr
    weightDelta = (self.out[l][1].T @ self.deltas[0] * self.lr) + (self.neural_net[l].previousDeltaWeight * self.m) #out [l][1] @ deltas[0] es el gradiente de los pesos de esa capa
    self.neural_net[l].W =  self.neural_net[l].W - weightDelta  
    self.neural_net[l].previousDeltaWeight = weightDelta #Guardamos el cambio de los pesos de esa iteracion

  def forward_pass(self, X):
    self.out = [(None, X)] #la capa anterior no existe, y X es la entrada 
    for l, layer in enumerate(self.neural_net):
      #z es suma ponderada q se ejecuta en la primera capa X = 70x100 .  W = 100x5 = 70, 5
      z = self.out[-1][1] @ (self.neural_net[l].W) + self.neural_net[l].b #capa anterior y X en la primera iteracion
      #a es la salida de la capa 1 y las demas
      a = self.neural_net[l].act_f(z) #funcion de act con la z
      self.out.append((z, a)) #ojo, out tiene 3 valores, no 2 como nuestra red

  def backward_pass(self, Y):
    self.deltas = []
    for l in reversed(range(0, len(self.neural_net))):
      #se le suma 1 porque out tiene 3 valores, el primero no importa (None, X), nunca llega a el, solo recorre 2 veces (len*red_neuronal)
      z = self.out[l+1][0] #z (suma ponderada) es el indice 0
      a = self.out[l+1][1] #a (activacion) es el indice 1
      #esto lo hace primero (ultima capa, osea primera mirando de atras a adelante)
      if l == len(self.neural_net) -1: #
      #calcular delta ultima capa
        self.deltas.insert(0, self.cost_function(a, Y, True) * self.neural_net[l].act_f(a, True)) #agregamelo al principio con el indice 0 siempre (first in first out)
      else:
        self.deltas.insert(0, self.deltas[0] @ _W.T * self.neural_net[l].act_f(a, True)) 

      #calcular delta capa previa
      _W = self.neural_net[l].W
      self.gradient_descent(l)


  def train(self, X, Y, train=True): #lr es el hiperparametro learning rate en el descenso del gradiente (factor por el cual multiplicamos al vector gradiente y te permite saber en q grado estas actualizando tu parametro en base a la inf q nos otorga el gradiente)
    self.forward_pass(X)
    if train:
      self.backward_pass(Y)           
    return self.out[-1][1]


