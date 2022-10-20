import dill
import os
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

def get_savedModelA():
  if os.path.isfile(outfileA):
    with open(outfileA, 'rb') as pickle_file:
        saved_model_A = dill.load(pickle_file)
        return saved_model_A
  return None

outfileB = os.path.join(dirname, './model500.pickle')

def get_savedModelB():
  if os.path.isfile(outfileB):
    with open(outfileB, 'rb') as pickle_file:
        saved_model_B = dill.load(pickle_file)
        return saved_model_B
  return None

outfileC = os.path.join(dirname, './model1000.pickle')

def get_savedModelC():
  if os.path.isfile(outfileC):
    with open(outfileC, 'rb') as pickle_file:
        saved_model_C = dill.load(pickle_file)
        return saved_model_C
  return None

def get_savedModel(name):
  outfileN = os.path.join(dirname, './'+name)

  if os.path.isfile(outfileN):
    with open(outfileN, 'rb') as pickle_file:
        saved_model_N = dill.load(pickle_file)
        return saved_model_N
  return None


def get_savedModelAttr(model_name):
  outfile = os.path.join(dirname, './'+model_name)
  if os.path.isfile(outfile):
    if model_name.endswith(".pickle"):
      atrr = model_name.split('.pickle')[0]
      atrr = atrr.split(',')
      atrr = {
        'model_name': atrr[0],
        'lr': float(atrr[1]) if len(atrr) > 1 else None,
        'momentum': float(atrr[2]) if len(atrr) > 2 else None,
        'epoch': int(atrr[3]) if len(atrr) > 3 else None,
        'topology': list(map(int, atrr[4].split('; '))) if len(atrr) > 4 else None,
        'val_percentage': float(atrr[5]) if len(atrr) > 5 else None,
      }
      return atrr
  return None


 

def list_savedModels():
  modelType = {
    'model100': 'A',
    'model500': 'B',
    'model1000': 'C'
  }
  saved_models = []
  for file in os.listdir(dirname):
    if file.endswith(".pickle"):
      # file = file.split('.pickle')[0]
      # file = file.split(',')
      # file = {
      #   'model_name': modelType[file[0]],
      #   'lr': float(file[1]) if len(file) > 1 else None,
      #   'momentum': float(file[2]) if len(file) > 2 else None,
      #   'epoch': int(file[3]) if len(file) > 3 else None,
      #   'topology': list(map(int, file[4].split('; '))) if len(file) > 4 else None,
      #   'act_f': file[5] if len(file) > 5 else None
      # }
      saved_models.append(file)
  return saved_models

def delete_savedModel(name):
  outfileN = os.path.join(dirname, './'+name)
  if os.path.isfile(outfileN):
    os.remove(outfileN)
    return True
  return False