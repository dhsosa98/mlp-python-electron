import dill
import os
import numpy as np
# import sys
# import os 
# from sys import platform

# if platform == "linux" or platform == "linux2":
#   # linux
#   os.chdir('../../mlp-python-electron')
#   sys.path.insert(0, rf'{os.getcwd()}/server/core')
# elif platform == "win32":
#   #windows
#   os.chdir(r'..\..\mlp-python-electron')
#   sys.path.insert(0, rf'{os.getcwd()}\server\core')

dirname = os.path.dirname(__file__)+'/../core/models/saves/'
outfileA = os.path.join(dirname, './model100.pickle')

with open(outfileA, 'rb') as pickle_file:
  saved_model_A = dill.load(pickle_file)

outfileB = os.path.join(dirname, './model500.pickle')

with open(outfileA, 'rb') as pickle_file:
  saved_model_B = dill.load(pickle_file)

outfileC = os.path.join(dirname, './model1000.pickle')

with open(outfileC, 'rb') as pickle_file:
  saved_model_C = dill.load(pickle_file)

def get_savedModel(name):
  outfileN = os.path.join(dirname, './'+name+'.pickle')

  if os.path.isfile(outfileN):
    with open(outfileN, 'rb') as pickle_file:
        saved_model_N = dill.load(pickle_file)
        return saved_model_N
  return None