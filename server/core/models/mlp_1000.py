import numpy as np
from ..entities import Model, neural_network
from ..utils import loadDatasets, splitIntoTestingDataset, splitIntoTrainingDataset, sigm, cost
import dill
import os
model_name = 'model1000'

absolute_path = os.path.abspath(os.path.dirname('datasets'))

path1000 = absolute_path+'/core//datasets/letras_distorsionadas1000.csv'

n=102
epoch = 20

data1000 = loadDatasets(path1000)

data1000 = np.array(data1000)

np.random.shuffle(data1000)

X_test, Y_test = splitIntoTestingDataset(data1000, n)
X_train, Y_train = splitIntoTrainingDataset(data1000, n)

epoch = 20
topology = [n-2, 5, 3]

X_test, Y_test = splitIntoTestingDataset(data1000, n)
X_train, Y_train = splitIntoTrainingDataset(data1000, n)

#Creamos la red neuronal
neural_net = neural_network(topology, sigm)

model = Model(neural_net.nn, cost, 0.5, 0.5)
for i in range (epoch):
 result = model.train(X_train, Y_train)

modelR = model.train(X_test, Y_test, False)
prediction = neural_net.get_prediction(modelR)
print(neural_net.accuracy(prediction, Y_test))

outfile = absolute_path+'/core/models/saves/'+model_name+'.pickle';
# Save the trained model as a pickle string.
with open(outfile, 'wb') as pickle_file:
  dill.dump(model, pickle_file)


