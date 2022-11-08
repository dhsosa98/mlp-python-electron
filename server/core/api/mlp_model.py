import numpy as np
from ..utils import sigm, lineal, cost

class Red_Neuronal:
    def __init__(self, hl_topology):
        self.plot_data = {'val': [], 'train': []}
        self.W = []
        self.b = []
        self.prevDeltaW = []
        self.hl_topology = hl_topology

        ################# Inicializamos los pesos #################

        # W de la primera capa oculta (cuyas entradas son X)
        self.W.append(np.random.randn(100, hl_topology[0]))
        self.b.append(np.random.randn(1, hl_topology[0]))
        self.prevDeltaW.append(np.zeros((100, hl_topology[0])))

        # W de las capas ocultas del medio.
        for i in range(len(hl_topology) - 1):
            self.W.append(np.random.randn(
                          (hl_topology[i], hl_topology[i+1])))
            self.b.append(np.random.randn(1, hl_topology[i+1]))
            self.prevDeltaW.append(
                np.zeros((hl_topology[i], hl_topology[i+1])))

        # W de la capa de salida 

        self.W.append(np.random.randn(hl_topology[-1], 3))
        self.b.append(np.random.randn(1, 3))
        self.prevDeltaW.append(np.zeros((hl_topology[-1], 3)))

    # Forward propagation

    def forward(self, X):
        self.z = []
        self.a = []
        self.z.append(X)
        self.a.append(X)

        for i in range(len(self.hl_topology)):
            # 1x100 @ 100x5 = 1x5
            self.z.append(np.dot(self.a[-1], self.W[i]) + self.b[i])
            self.a.append(lineal(self.z[-1]))

        # Calculo a y z para la ULTIMA capa
        # 1x5 @ 5x3 = 1x3
        self.z.append(np.dot(self.a[-1], self.W[-1]) + self.b[-1])
        self.a.append(sigm(self.z[-1]))
        return self.a[-1]

    def backward(self, Y):
        self.gradienteW = []
        self.gradienteb = []
        self.deltaPeso = []
        self.deltas = []

        # TODO ESTO PARA LA CAPA DE SALIDA
        # El error lo calculamos restando la clase predecida con la clase real y multiplicando por la derivada de sigm de esa salida
        self.deltas.append(
            (cost(self.a[-1], Y, True)) * sigm(self.a[-1], True))

        # El cambio en el peso lo calculamos como el producto matricial de la salida
        # de la ultima capa oculta, por el delta anteriormente calculado
        # y tmb le agregamos el momentummmm
        self.gradienteW.append(np.dot(self.a[-2].T, self.deltas[-1]))

        # Y bueno el parametro bayas es dsp actualizarlo a el mismo menos el delta por lr
        self.gradienteb.append(self.deltas[-1])

        # DESDE ACA LOS DELTAS PARA LAS CAPAS OCULTAS

        # Recorremos de atras para adelante, le hago hasta -1 para al final hacer el W entre la capa de entrada y la primera oculta
        for i in range(len(self.hl_topology), 0, -1):
            # Nuevo delta = Ultimo delta calculado por la transpuesta de la matriz de pesos de la capa donde estamos parados
            # por la derivada de sus funciones de activacion
            # print('primero',self.deltas[-1].shape, pW.T.shape, self.a[i].shape)
            self.deltas.append(
                np.dot(self.deltas[-1], self.W[i].T) * lineal(self.a[i], True))
            # 1x3 @ 3x10 = 1x10
            # 1x10 @ 10x10 = 1x10

            # El cambio en el peso lo calculamos como la salida de la capa anterior a la que estamos ahora, por el ultimo delta calculado
            # print('segundo',self.a[i-1].T.shape, self.deltas[-1].shape, self.prevDeltaW[i-1].shape)
            self.gradienteW.append(np.dot(self.a[i-1].T, self.deltas[-1]))
            # 10x1 @ 1x10 = 10x10
            # 100x1 @ 1x10 = 100x10

            # Y bueno el parametro bayas es dsp actualizarlo a el mismo menos el delta por lr
            self.gradienteb.append(self.deltas[-1])
            # print('resguardo peso', self.W[i-1].shape)

        # Como nos movimos de atras para adelante, ahoras revertimos el orden (para actualizar pesos y bayas)

        self.gradienteW.reverse()
        self.gradienteb.reverse()
        self.deltas.reverse()

    # Actualizamos los W y b
    def update(self, lr, m):
        for i in range(len(self.hl_topology) + 1):
            deltaWeight = self.gradienteW[i] * lr + self.prevDeltaW[i] * m
            self.W[i] = self.W[i] - deltaWeight
            self.prevDeltaW[i] = deltaWeight
            self.b[i] = self.b[i] - self.gradienteb[i] * lr

    # Definimos la funcion para utilizar solo el forward (en realidad se usa al usar la funcion MSE)
    def predict(self, X, Y):
        return self.forward(X)

    def train(self, X, Y, lr, m):
        for x, y in zip(X, Y):
            x.shape += (1,)
            y.shape += (1,)
            y = y.T  # 1x3
            # 1x100 #lr es el hiperparametro learning rate en el descenso del gradiente (factor por el cual multiplicamos al vector gradiente y te permite saber en q grado estas actualizando tu parametro en base a la inf q nos otorga el gradiente)
            x = x.T
            self.forward(x)
            self.backward(y)
            self.update(lr, m)

    def get_prediction(self, model):
        return np.argmax(model, 1)

    def accuracy(self, prediction, Y):
        Y_arg = np.argmax(Y, 1)
        return (np.sum(prediction == Y_arg) / Y_arg.size)*100
