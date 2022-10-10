import numpy as np
from ..entities import Model, neural_network
from ..utils import loadDatasets, splitIntoTestingDataset, splitIntoTrainingDataset, sigm, cost, lineal
import dill
import os

def trainModelA(lr=0.5, momentum=0.5, epoch=20, hl_topology = [5], act_f='lineal'):

  if(act_f == 'lineal'):
    act_f = lineal
  else:
    act_f = sigm

  initialLayer = [100]

  outputLayer = [3]

  topology = initialLayer + hl_topology + outputLayer

  model_name = 'model100,'+str(lr)+','+str(momentum)+','+str(epoch)+','+'; '.join(list(map(str, topology)))+','+act_f.__name__

  path100 = os.path.dirname(__file__)+'/../datasets/letras_distorsionadas100.csv'

  n=102

  data100 = loadDatasets(path100)

  data100 = np.array(data100)

  np.random.shuffle(data100)

  X_test, Y_test = splitIntoTestingDataset(data100, n)
  X_train, Y_train = splitIntoTrainingDataset(data100, n)


  X_test, Y_test = splitIntoTestingDataset(data100, n)
  X_train, Y_train = splitIntoTrainingDataset(data100, n)

  #Creamos la red neuronal
  neural_net = neural_network(topology, act_f)

  model = Model(neural_net.nn, cost, lr, momentum)

  for i in range (epoch):
    result = model.train(X_train, Y_train)

  modelR = model.train(X_test, Y_test, False)
  prediction = neural_net.get_prediction(modelR)
  # print(neural_net.accuracy(prediction, Y_test))

  outfile = os.path.dirname(__file__)+'/saves/'+model_name+'.pickle';
  # Save the trained model as a pickle string.
  with open(outfile, 'wb') as pickle_file:
    dill.dump(model, pickle_file)

  return {
    'model_name': model_name,
    'accuracy': round(neural_net.accuracy(prediction, Y_test), 2),
    'MSE_test': round(cost(modelR, Y_test), 2),
    'MSE_train': round(cost(result, Y_train), 2),
    'training_cases': len(Y_train),
    'test_cases': len(Y_test),
    'amount_of_epochs': epoch,
    'learning_rate': lr,
    'momentum': momentum,
    'topology': topology,
    'activation_function': act_f.__name__
  }


