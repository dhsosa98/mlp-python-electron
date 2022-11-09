import numpy as np
from ..utils.functions import sigm, lineal, cost
# Definimos el algoritmo de entrenamiento


class Mlp_Model:
    def __init__(self, hl_topology):
        # Plot Data es para luego graficar el MSE Global
        self.plot_data = {'val': [], 'train': []}
        # Historial de resultados obtenidos en cada epoca
        self.history = {}
        # Pesos de la red
        self.W = []
        # Bias de la red
        self.b = []
        # Pesos de la red en la epoca anterior para el momentum
        self.prevDeltaW = []
        # Topologia de las capas ocultas
        self.hl_topology = hl_topology

        # Inicializamos la capa de entrada

        # Los pesos de la capa de entrada los inicializamos con valores aleatorios
        # Se utilizo esta tecnica de generacion de pesos aleatorios para mejorar los gradientes: https://towardsdatascience.com/weight-initialization-techniques-in-neural-networks-26c649eb3b78
        self.W.append(np.random.rand(100,hl_topology[0])*np.sqrt(1/(100+hl_topology[0])))
        self.b.append(np.zeros((1, hl_topology[0])))
        self.prevDeltaW.append(np.zeros((100, hl_topology[0])))

        # Inicializamos las capas ocultas

        for i in range(len(hl_topology) - 1):
            self.W.append(np.random.rand(hl_topology[i],hl_topology[i+1])*np.sqrt(1/(hl_topology[i]+hl_topology[i+1])))
            self.b.append(np.zeros((1, hl_topology[i+1])))
            self.prevDeltaW.append(
                np.zeros((hl_topology[i], hl_topology[i+1])))

        # Inicializamos la ultima capa

        self.W.append(np.random.rand(hl_topology[-1],3)*np.sqrt(1/(hl_topology[-1]+3)))
        self.b.append(np.zeros((1, 3)))
        self.prevDeltaW.append(np.zeros((hl_topology[-1], 3)))

    # Realizamos la propagacion hacia adelante
    def forward(self, X):
        # z es la suma ponderada de los pesos y los valores de entrada de la neurona
        self.z = []
        # a es el valor de salida de la neurona despues de aplicar la funcion de activacion
        self.a = []
        # Se agrega el patron de entrada a la lista de valores de salida de la capa de entrada
        self.z.append(X)
        self.a.append(X)

        # Se recorren las capas ocultas
        for i in range(len(self.hl_topology)):
            # Ej: 1x100 @ 100x5 = 1x5
            self.z.append(np.dot(self.a[-1], self.W[i]) + self.b[i])
            self.a.append(lineal(self.z[-1]))

        # Calculo a y z para la ULTIMA capa
        # Ej: 1x5 @ 5x3 = 1x3
        self.z.append(np.dot(self.a[-1], self.W[-1]) + self.b[-1])
        self.a.append(sigm(self.z[-1]))
        # Se retorna el valor de salida de la ultima capa
        return self.a[-1]

    # Realizamos la propagacion hacia atras
    def backward(self, Y):
        # Definimos la lista de gradientes de los pesos
        self.gradientW = []
        # Definimos la lista de gradientes de los bias
        self.gradientb = []
        # Definimos la lista de deltas
        self.deltas = []

        # LO DE ABAJO PARA LA CAPA DE SALIDA
        # El error lo calculamos restando la clase predecida con la clase real y multiplicando por la derivada de sigm de esa salida
        self.deltas.append(
            (cost(self.a[-1], Y, True)) * sigm(self.a[-1], True))

        # El cambio en el peso lo calculamos como el producto matricial de la salida
        # de la ultima capa oculta, por el delta anteriormente calculado
        # y tmb le agregamos el momentum
        self.gradientW.append(np.dot(self.a[-2].T, self.deltas[-1]))

        # Y bueno el parametro bayas es dsp actualizarlo a el mismo menos el delta por lr
        self.gradientb.append(self.deltas[-1])

        # DESDE ACA LOS DELTAS PARA LAS CAPAS OCULTAS

        # Recorremos de atras para adelante, le hago hasta -1 para al final hacer el W entre la capa de entrada y la primera oculta
        for i in range(len(self.hl_topology), 0, -1):
            # Nuevo delta = Ultimo delta calculado por la transpuesta de la matriz de pesos de la capa donde estamos parados
            # por la derivada de sus funciones de activacion
            self.deltas.append(
                np.dot(self.deltas[-1], self.W[i].T) * lineal(self.a[i], True))
            # El cambio en el peso lo calculamos como la salida de la capa anterior a la que estamos ahora, por el ultimo delta calculado
            self.gradientW.append(np.dot(self.a[i-1].T, self.deltas[-1]))

            # Y bueno el parametro bayas es dsp actualizarlo a el mismo menos el delta por lr
            self.gradientb.append(self.deltas[-1])

        # Como nos movimos de atras para adelante, ahoras revertimos el orden (para actualizar pesos y bayas)
        self.gradientW.reverse()
        self.gradientb.reverse()
        self.deltas.reverse()

    # Actualizamos los W y b
    def update(self, lr, m):
        # Recorremos las capas
        for i in range(len(self.hl_topology) + 1):
            # Calculamos el cambio en los pesos para usarlo en el momentum
            deltaWeight = self.gradientW[i] * lr + self.prevDeltaW[i] * m
            # Actualizamos los pesos
            self.W[i] = self.W[i] - deltaWeight
            # Guardamos el cambio en los pesos para usarlo en el momentum en la siguiente iteracion
            self.prevDeltaW[i] = deltaWeight
             # Actualizamos los bias
            self.b[i] = self.b[i] - self.gradientb[i] * lr

    # Definimos la funcion para utilizar solo el forward (en realidad se usa al usar la funcion MSE)
    def predict(self, X, Y):
        return self.forward(X)

    # Definimos la funcion para entrenar la red
    def train(self, X, Y, lr, m):
        # Se recorre por patrones
        # Zip relaciona cada patron con su clase correspondiente
        for x, y in zip(X, Y):
            # Se le agrega una dimension al patron para que sea un vector nx1 donde n es la cantidad de atributos
            x.shape += (1,)
            # Se le agrega una dimension a la clase para que sea un vector 3x1 donde 3 es la cantidad de clases
            y.shape += (1,)
            y = y.T  # 1x3 
            x = x.T # 1x100
            self.forward(x)
            self.backward(y)
            self.update(lr, m)

    # Definimos la funcion para obtener la neurona con mayor probabilidad
    def get_prediction(self, model):
        return np.argmax(model, 1)

    # Definimos la funcion para obtener la precision de la red
    def get_accuracy(self, prediction, Y):
        Y_arg = np.argmax(Y, 1)
        return (np.sum(prediction == Y_arg) / Y_arg.size)*100
