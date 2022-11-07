import numpy as np
from ..entities import Mlp_Model
from fastapi import HTTPException
from ..utils.functions import cost
from ..utils.load_datasets import load_datasets
from ..utils.split_datasets import splitDatasets
import dill
import os


def train_mlp_model(lr=0.5, momentum=0.5, epoch=20, hl_topology=[5], val_percentage=0.1, save=False, dataset='letras_distorsionadas1000.csv'):

    models = {
        'letras_distorsionadas100.csv': 'model100',
        'letras_distorsionadas500.csv': 'model500',
        'letras_distorsionadas1000.csv': 'model1000'
    }

    # Definimos la topologia de la capa de entrada
    initialLayer = [100]

    # Definimos la topologia de la capa de salida
    outputLayer = [3]

    # Definimos la topologia de la red
    topology = initialLayer + hl_topology + outputLayer

    # Definimos el nombre del modelo (cantidad de datasets, coeficiente de aprendizaje, momentum, epocas, topologia, porcentaje de validacion)
    model_name = models[dataset]+','+str(lr)+','+str(momentum)+','+str(epoch) + \
        ','+'; '.join(list(map(str, topology)))+','+str(val_percentage)

    # Definimos el path del dataset
    path = os.path.dirname(__file__) + \
        '/../datasets/'+dataset
    
    # Si el dataset no existe, lanzamos un error
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Dataset not found")


    # Obtenemos el dataset
    data = load_datasets(path)

    data = np.array(data)

    # Obtenemos los datos de test, entrenamiento, validacion
    X_test, Y_test, X_train, Y_train, X_val, Y_val = splitDatasets(
        data, val_percentage)


    # Creamos el modelo
    model = Mlp_Model(hl_topology)

    # Definimos los arreglos para graficar los datos
    plot_validation = []
    plot_train = []

    # Entrenamos el modelo en cada epoca
    for i in range(epoch):
        model.train(X_train, Y_train, lr, momentum)

        # Obtenemos el resultado de la prediccion
        result_train = model.predict(X_train, Y_train)
        result_validation = model.predict(X_val, Y_val)

        # Agregamos los datos para graficar
        plot_validation.append({'y': round(cost(result_validation, Y_val), 6), 'x': i+1})
        plot_train.append({'y': round(cost(result_train, Y_train), 6), 'x': i+1})


    # Obtenemos la neurona con mayor probabilidad de cada patron (Validacion)
    prediction_validation = model.get_prediction(result_validation)

    #Obtenemos el resultado de la prediccion (Test)
    result_test = model.predict(X_test, Y_test)

    # Obtenemos la neurona con mayor probabilidad de cada patron (Test)
    prediction_test = model.get_prediction(result_test)

    # Si se desea guardar el modelo, lo guardamos
    if save == True:
        # Le pasamos al modelo los datos para graficar
        model.plot_data = {'val': plot_validation, 'train': plot_train}

        # Guardamos el historial de la red
        model.history = {"results": {
            'model_name': model_name,
            'accuracy_val': round(model.get_accuracy(prediction_validation, Y_val), 6),
            'MSE_train': round(cost(result_train, Y_train), 6),
            'MSE_val': round(cost(result_validation, Y_val), 6),
            'training_cases': len(Y_train),
            'validation_cases': len(Y_val),
            'amount_of_epochs': epoch,
            'val_percentage': val_percentage,
            'learning_rate': lr,
            'momentum': momentum,
            'topology': topology,
        }
        }
        outfile = os.path.dirname(__file__)+'/../models/'+model_name+'.pickle'

        # Guardamos el modelo
        with open(outfile, 'wb') as pickle_file:
            dill.dump(model, pickle_file)

        # Retornamos un mensaje de exito
        return {
            'saved': True,
            'message': 'Model Successfully Saved',
        }

    # Devolvemos los resultados y la data para graficar
    return {
        "results": {
            'model_name': model_name,
            'accuracy_val': round(model.get_accuracy(prediction_validation, Y_val), 6),
            'MSE_train': round(cost(result_train, Y_train), 6),
            'MSE_val': round(cost(result_validation, Y_val), 6),
            'training_cases': len(Y_train),
            'validation_cases': len(Y_val),
            'amount_of_epochs': epoch,
            'val_percentage': val_percentage,
            'learning_rate': lr,
            'momentum': momentum,
            'topology': topology,
            'test': {
                'accuracy_test': round(model.get_accuracy(prediction_test, Y_test), 6),
                'MSE_test': round(cost(result_test, Y_test), 6),
                'test_cases': len(Y_test),
            }
        },
        'plot_data': {'val': plot_validation, 'train': plot_train},

    }
