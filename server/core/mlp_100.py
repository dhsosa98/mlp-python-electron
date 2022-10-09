import numpy as np
from entities import Model, neural_network
from utils import loadDatasets, splitIntoTestingDataset, splitIntoTrainingDataset, sigm, cost
import dill
import os

model_name = 'model100'

absolute_path = os.path.abspath(os.path.dirname('datasets'))

path100 = absolute_path+'./datasets/letras_distorsionadas100.csv'

n=102
epoch = 20

data100 = loadDatasets(path100)

data100 = np.array(data100)

np.random.shuffle(data100)

X_test, Y_test = splitIntoTestingDataset(data100, n)
X_train, Y_train = splitIntoTrainingDataset(data100, n)

epoch = 20
topology = [n-2, 5, 3]

X_test, Y_test = splitIntoTestingDataset(data100, n)
X_train, Y_train = splitIntoTrainingDataset(data100, n)

#Creamos la red neuronal
neural_net = neural_network(topology, sigm)

model = Model(neural_net.nn, cost, 0.5, 0.5)
for i in range (epoch):
 result = model.train(X_train, Y_train)

modelR = model.train(X_test, Y_test, False)
prediction = neural_net.get_prediction(modelR)
print(neural_net.accuracy(prediction, Y_test))

outfile = absolute_path+'/models/saves/'+model_name+'.pickle';
# Save the trained model as a pickle string.
with open(outfile, 'wb') as pickle_file:
  dill.dump(model, pickle_file)



