import dill
import os

dirname = os.path.dirname(__file__)+'/../models/'

# Definimos la funcion para obtener el modelo guardado
def get_savedModel(name):
    name = name+'.pickle'
    outfileN = os.path.join(dirname, './'+name)

    if os.path.isfile(outfileN):
        with open(outfileN, 'rb') as pickle_file:
            saved_model_N = dill.load(pickle_file)
            return saved_model_N
    return None


# Definimos la funcion para obtener los atributos de un modelo guardado
def get_savedModelAttr(saved_model):
    results = saved_model.history['results']
    atrr = {
        'model_name': results['model_name'],
        'amount_datasets': results['amount_datasets'],
        'amount_of_epochs': results['amount_of_epochs'],
        'val_percentage': results['val_percentage'],
        'learning_rate': results['learning_rate'],
        'momentum': results['momentum'],
        'topology': results['topology'],
    }
    return atrr

# Definimos la funcion para optener todos los modelos guardados
def list_savedModels():
    saved_models = []
    for file in os.listdir(dirname):
        if file.endswith(".pickle"):
            saved_models.append(file.split('.pickle')[0])
    return saved_models


# Definimos la funcion para eliminar un modelo guardado
def delete_savedModel(name):
    name = name+'.pickle'
    outfileN = os.path.join(dirname, './'+name)
    if os.path.isfile(outfileN):
        os.remove(outfileN)
        return True
    return False
