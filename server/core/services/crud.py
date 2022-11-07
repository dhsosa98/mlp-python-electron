import dill
import os

dirname = os.path.dirname(__file__)+'/../models/'

# Definimos la funcion para obtener el modelo guardado
def get_savedModel(name):
    outfileN = os.path.join(dirname, './'+name)

    if os.path.isfile(outfileN):
        with open(outfileN, 'rb') as pickle_file:
            saved_model_N = dill.load(pickle_file)
            return saved_model_N
    return None


# Definimos la funcion para obtener los atributos de un modelo guardado
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


# Definimos la funcion para optener todos los modelos guardados
def list_savedModels():
    saved_models = []
    for file in os.listdir(dirname):
        if file.endswith(".pickle"):

            saved_models.append(file)
    return saved_models


# Definimos la funcion para eliminar un modelo guardado
def delete_savedModel(name):
    outfileN = os.path.join(dirname, './'+name)
    if os.path.isfile(outfileN):
        os.remove(outfileN)
        return True
    return False
