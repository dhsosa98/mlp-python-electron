import numpy as np
from entities import Model, neural_network
from utils import loadDatasets, splitIntoTestingDataset, splitIntoTrainingDataset, sigm, cost
import dill
import os

model_name = 'model500'

absolute_path = os.path.abspath(os.path.dirname('datasets'))

path500 = absolute_path+'./datasets/letras_distorsionadas500.csv'

n=102
epoch = 20

data500 = loadDatasets(path500)

data500 = np.array(data500)

np.random.shuffle(data500)

X_test, Y_test = splitIntoTestingDataset(data500, n)
X_train, Y_train = splitIntoTrainingDataset(data500, n)

epoch = 20
topology = [n-2, 5, 3]

X_test, Y_test = splitIntoTestingDataset(data500, n)
X_train, Y_train = splitIntoTrainingDataset(data500, n)

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



