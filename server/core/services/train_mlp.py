import numpy as np
from ..entities import Mlp_Model
from fastapi import HTTPException
from ..utils.functions import cost
from ..utils.load_datasets import load_datasets
from ..utils.split_datasets import splitDatasets
from ..datasets.generate_datasets import available_letters, default_csv_name
import dill
import os

def train_mlp_model(lr=0.5, momentum=0.5, epoch=20, hl_topology=[5], val_percentage=0.1, save=False, amount_datasets=1000, name=None):

    # Definimos la topologia de la capa de entrada
    initial_layer = [100]

    # Definimos la topologia de la capa de salida
    output_layer = [len(available_letters)]

    # Definimos la topologia de la red
    topology = initial_layer + hl_topology + output_layer

    # Definimos el nombre del modelo (cantidad de datasets, coeficiente de aprendizaje, momentum, epocas, topologia, porcentaje de validacion)
    if not name:
        model_name = f'model{amount_datasets}datasets_lr{lr}_m{momentum}_epochs{epoch}_topology{(list(map(str, topology)))}_val%{val_percentage}'
    else:
        model_name = name

    # Definimos el path del dataset
    path = f'{os.path.dirname(__file__)}/../datasets/{default_csv_name}{amount_datasets}.csv'
    
    # Si el dataset no existe, lanzamos un error
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    # Obtenemos el dataset
    data = load_datasets(path)

    # Convertimos la data a un array np
    data = np.array(data)

    # Obtenemos los datos de test, entrenamiento, validacion
    X_test, Y_test, X_train, Y_train, X_val, Y_val = splitDatasets(
        data, val_percentage)


    # Creamos el modelo
    model = Mlp_Model(hl_topology)

    # Definimos los arreglos para graficar los datos
    plot_validation = []
    plot_train = []

    #min = 10000

    # Entrenamos el modelo en cada epoca
    for i in range(epoch):
        model.train(X_train, Y_train, lr, momentum)

        # Obtenemos el resultado de la prediccion
        result_train = model.predict(X_train, Y_train)
        result_validation = model.predict(X_val, Y_val)

        # Si el error de validacion es menor al minimo, actualizamos el minimo

        #if min>cost(result_validation, Y_val):
            #min = cost(result_validation, Y_val)
        #else: 
            #break

        # Agregamos los datos para graficar
        plot_validation.append({'y': round(cost(result_validation, Y_val), 6), 'x': i+1})
        plot_train.append({'y': round(cost(result_train, Y_train), 6), 'x': i+1})

    # Obtenemos la neurona con mayor probabilidad de cada patron (Validacion) 
    prediction_validation = model.get_predictionIndex(result_validation)

    #epoch = len(plot_train)

    #Obtenemos el resultado de la prediccion (Test) 
    result_test = model.predict(X_test, Y_test)

    # Obtenemos la neurona con mayor probabilidad de cada patron (Test)
    prediction_test = model.get_predictionIndex(result_test)

    # Obtenemos la precision del conjunto de validacion y test
    accuracy_test = round(model.get_accuracy(prediction_test, Y_test), 6)
    accuracy_val = round(model.get_accuracy(prediction_validation, Y_val), 6)

    # Obtenemos el error cuadratico medio del conjunto de validacion, entrenamiento y test
    MSE_train = round(cost(Y_train, result_train), 6)
    MSE_val = round(cost(Y_val, result_validation), 6)
    MSE_test = round(cost(Y_test, result_test), 6)
    
    # Si se desea guardar el modelo, lo guardamos
    if save == True:
        # Le pasamos al modelo los datos para graficar
        model.plot_data = {'val': plot_validation, 'train': plot_train}

        # Guardamos el historial de la red
        model.history = {
            "results": {
                'model_name': model_name,
                'amount_datasets': amount_datasets,
                'accuracy_val': accuracy_val,
                'MSE_train': MSE_train,
                'MSE_val': MSE_val,
                'training_cases': len(Y_train),
                'validation_cases': len(Y_val),
                'amount_of_epochs': epoch,
                'val_percentage': val_percentage,
                'learning_rate': lr,
                'momentum': momentum,
                'topology': topology,
            'test': {
                'accuracy_test': accuracy_test,
                'MSE_test': MSE_test,
                'test_cases': len(Y_test),
            }
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
                'amount_datasets': amount_datasets,
                'accuracy_val': accuracy_val,
                'MSE_train': MSE_train,
                'MSE_val': MSE_val,
                'training_cases': len(Y_train),
                'validation_cases': len(Y_val),
                'amount_of_epochs': epoch,
                'val_percentage': val_percentage,
                'learning_rate': lr,
                'momentum': momentum,
                'topology': topology,
            'test': {
                'accuracy_test': accuracy_test,
                'MSE_test': MSE_test,
                'test_cases': len(Y_test),
            },
        },
        'plot_data': {'val': plot_validation, 'train': plot_train}
    }
