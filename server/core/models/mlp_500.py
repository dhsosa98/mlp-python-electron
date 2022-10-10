import numpy as np
from ..entities import Model, neural_network
from ..utils import loadDatasets, splitIntoTestingDataset, splitIntoTrainingDataset, sigm, cost,lineal
import dill
import os

def trainModelB(lr=0.5, momentum=0.5, epoch=20, hl_topology = [5], act_f='lineal'):

  if(act_f == 'lineal'):
    act_f = lineal
  else:
    act_f = sigm

  initialLayer = [100]

  outputLayer = [3]

  topology = initialLayer + hl_topology + outputLayer

  model_name = 'model500,'+str(lr)+str(momentum)+str(epoch)+'top.'+', '.join(list(map(str, topology)))+','+act_f.__name__

  absolute_path = os.path.abspath(os.path.dirname('mlp-python-electron'))

  path500 = absolute_path+'./core/datasets/letras_distorsionadas100.csv'

  n=102

  data500 = loadDatasets(path500)

  data500 = np.array(data500)

  np.random.shuffle(data500)

  X_test, Y_test = splitIntoTestingDataset(data500, n)
  X_train, Y_train = splitIntoTrainingDataset(data500, n)

  X_test, Y_test = splitIntoTestingDataset(data500, n)
  X_train, Y_train = splitIntoTrainingDataset(data500, n)

  #Creamos la red neuronal
  neural_net = neural_network(topology, sigm)

  model = Model(neural_net.nn, cost, lr, momentum)
  for i in range (epoch):
    result = model.train(X_train, Y_train)

  modelR = model.train(X_test, Y_test, False)
  prediction = neural_net.get_prediction(modelR)
  # print(neural_net.accuracy(prediction, Y_test))

  outfile = absolute_path+'/core/models/saves/'+model_name+'.pickle';
  # Save the trained model as a pickle string.
  with open(outfile, 'wb') as pickle_file:
    dill.dump(model, pickle_file)

  return {
    'model_name': model_name,
    'accuracy': neural_net.accuracy(prediction, Y_test),
    'MSE_test': cost(modelR, Y_test),
    'MSE_train': cost(result, Y_train),
    'training_cases': len(Y_train),
    'test_cases': len(Y_test),
    'amount_of_epochs': epoch,
    'learning_rate': lr,
    'momentum': momentum,
    'hidden_layers': hl_topology,
    'activation_function': act_f.__name__
  }



