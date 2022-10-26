import numpy as np
from ..entities import Model, neural_network
from ..utils import loadDatasets, splitIntoTestingDataset, splitIntoTrainingDataset, splitIntoValidationDataset, cost
import dill
import os
import pandas as pd

def trainModelC(lr=0.5, momentum=0.5, epoch=20, hl_topology = [5], val_percentage=0.1, save=False):

  initialLayer = [100]

  outputLayer = [3]

  topology = initialLayer + hl_topology + outputLayer

  model_name = 'model1000,'+str(lr)+','+str(momentum)+','+str(epoch)+','+'; '.join(list(map(str, topology)))+','+str(val_percentage)

  path = os.path.dirname(__file__)+'/../datasets/letras_distorsionadas1000.csv'
  if not os.path.isfile(path):
      return {
          'message': 'Dataset not found'
      }

  n=102

  data = loadDatasets(path)

  data = np.array(data)

  X_val, Y_val, data_et = splitIntoValidationDataset(data, n, val_percentage)
  X_train, Y_train = splitIntoTrainingDataset(data_et, n)
  neural_net = neural_network(topology)

  model = Model(neural_net.nn, cost, lr, momentum)
  plot_v = []
  plot_train = []

  for i in range (epoch):
    result = model.train(X_train, Y_train)
    result_v = model.train(X_val, Y_val, False)
    plot_v.append({'y': round(cost(result_v, Y_val), 4), 'x': i+1})
    plot_train.append({'y': round(cost(result, Y_train), 4), 'x': i+1})

  result_v = model.train(X_val, Y_val, False)
  prediction_v = neural_net.get_prediction(result_v)

  if save==True:
    outfile = os.path.dirname(__file__)+'/saves/'+model_name+'.pickle';
    # Save the trained model as a pickle string.
    with open(outfile, 'wb') as pickle_file:
      dill.dump(model, pickle_file)
    
    return {
      'saved': True,
      'message': 'Model saved successfully',
    }

  return {
    'model_name': model_name,
    'accuracy_val': round(neural_net.accuracy(prediction_v, Y_val), 2),
    'MSE_train': round(cost(result, Y_train), 4),
    'MSE_val': round(cost(result_v, Y_val), 4),
    'training_cases': len(Y_train),
    'validation_cases': len(Y_val),
    'amount_of_epochs': epoch,
    'learning_rate': lr,
    'momentum': momentum,
    'topology': topology,
    'plot_data': {'val': plot_v, 'train': plot_train},
  }



