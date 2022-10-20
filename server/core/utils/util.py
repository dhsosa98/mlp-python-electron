import numpy as np
import pandas as pd

def one_hot(Y):
  one_hot_Y = np.zeros((Y.size, Y.max()), dtype=float) 
  one_hot_Y[np.arange(Y.size), Y-1] = 1
  return one_hot_Y

def loadDatasets(path):
  return pd.read_csv(path)

def splitIntoTestingDataset(data, n):
  m = int(0.3 * data[:,1].size)
  data = data[0:m].T
  Y = one_hot(data[0])
  X = data[2:n].T
  return X, Y

def splitIntoTrainingDataset(data, n):
  m = int(0.3 * data[:,1].size)
  data = data[m:data[:,1].size].T
  Y = one_hot(data[0])
  X = data[2:n].T
  return X, Y

def splitIntoValidationDataset(data, n, val_percentage):
  m = int(val_percentage * data[:,1].size)
  data_et = data[m:data[:,1].size]
  data = data[0:m].T
  Y = one_hot(data[0])
  X = data[2:n].T
  return X, Y, data_et