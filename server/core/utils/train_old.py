import numpy as np
from entities.mlp_model import Model
from functions import sigm, lineal, relu, cost
from entities.neural_network import neural_network
from utils.utils import loadDatasets, splitIntoTestingDataset, splitIntoTrainingDataset
import dill
import os

absolute_path = os.path.abspath(os.path.dirname('datasets'))

path100 = absolute_path+'../../datasets/letras_distorsionadas100.csv'
path500 = absolute_path+'../../datasets/letras_distorsionadas100.csv'
path1000 = absolute_path+'../../datasets/letras_distorsionadas100.csv'

n=102
epoch = 20

data100 = loadDatasets(path100)
data500 = loadDatasets(path500)
data1000 = loadDatasets(path1000)

data100 = np.array(data100)
data500 = np.array(data500)
data1000 = np.array(data1000)

np.random.shuffle(data100)
np.random.shuffle(data500)
np.random.shuffle(data1000)

X_test, Y_test = splitIntoTestingDataset(data100, n)
X_train, Y_train = splitIntoTrainingDataset(data100, n)

epoch = 20
topology = [n-2, 5, 3]

X_test, Y_test = splitIntoTestingDataset(data100)
X_train, Y_train = splitIntoTrainingDataset(data100)

#Creamos la red neuronal
neural_net = neural_network(topology, sigm)

model = Model(neural_net.nn, cost, 0.5, 0.5)
for i in range (epoch):
 result = model.train(X_train, Y_train)

modelR = model.train(X_test, Y_test, False)
prediction = neural_net.get_prediction(modelR)
print(neural_net.accuracy(prediction, Y_test))

outfile = absolute_path+'/models/saves/model1000.pickle';
# Save the trained model as a pickle string.
with open(outfile, 'wb') as pickle_file:
  dill.dump(model, pickle_file)


with open(outfile, 'rb') as pickle_file:
  saved_model_r = dill.load(pickle_file)

