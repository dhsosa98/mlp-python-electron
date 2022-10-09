import dill
import os
import numpy as np
import sys
import os 

absolute_path = os.path.abspath(os.path.dirname('core'))
sys.path.insert(0, r'C:\Users\Diego\mlp_electron\server\core')
print(sys.path)

dirname = os.path.dirname(__file__)+'/models/saves/'
outfileA = os.path.join(dirname, './model100.pickle')

with open(outfileA, 'rb') as pickle_file:
  saved_model_A = dill.load(pickle_file)

outfileB = os.path.join(dirname, './model500.pickle')

with open(outfileA, 'rb') as pickle_file:
  saved_model_B = dill.load(pickle_file)

outfileC = os.path.join(dirname, './model1000.pickle')

with open(outfileC, 'rb') as pickle_file:
  saved_model_C = dill.load(pickle_file)

