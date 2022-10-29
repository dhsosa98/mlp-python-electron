import numpy as np
from ..entities import Red_Neuronal
from fastapi import HTTPException
from ..utils import loadDatasets, splitIntoTrainingDataset, splitIntoValidationDataset, cost
import dill
import os
import pandas as pd


def trainModel(lr=0.5, momentum=0.5, epoch=20, hl_topology=[5], val_percentage=0.1, save=False, dataset='letras_distorsionadas1000.csv'):

    initialLayer = [100]

    outputLayer = [3]

    topology = initialLayer + hl_topology + outputLayer

    model_name = 'model100,'+str(lr)+','+str(momentum)+','+str(epoch) + \
        ','+'; '.join(list(map(str, topology)))+','+str(val_percentage)

    path = os.path.dirname(__file__) + \
        '/../datasets/'+dataset
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    n = 102

    data = loadDatasets(path)

    data = np.array(data)

    X_val, Y_val, data_et = splitIntoValidationDataset(data, n, val_percentage)
    X_train, Y_train = splitIntoTrainingDataset(data_et, n)

    model = Red_Neuronal(hl_topology)
    plot_v = []
    plot_train = []

    for i in range(epoch):
        model.train(X_train, Y_train, lr, momentum)
        result = model.predict(X_train, Y_train)
        result_v = model.predict(X_val, Y_val)
        plot_v.append({'y': round(cost(result_v, Y_val), 4), 'x': i+1})
        plot_train.append({'y': round(cost(result, Y_train), 4), 'x': i+1})

    result_v = model.predict(X_val, Y_val)
    prediction_v = model.get_prediction(result_v)

    if save == True:
        model.plot_data = {'val': plot_v, 'train': plot_train}
        outfile = os.path.dirname(__file__)+'/saves/'+model_name+'.pickle'
        # Save the trained model as a pickle string.
        with open(outfile, 'wb') as pickle_file:
            dill.dump(model, pickle_file)

        return {
            'saved': True,
            'message': 'Model Successfully Saved',
        }

    return {
        "results": {
            'model_name': model_name,
            'accuracy_val': round(model.accuracy(prediction_v, Y_val), 2),
            'MSE_train': round(cost(result, Y_train), 4),
            'MSE_val': round(cost(result_v, Y_val), 4),
            'training_cases': len(Y_train),
            'validation_cases': len(Y_val),
            'amount_of_epochs': epoch,
            'val_percentage': val_percentage,
            'learning_rate': lr,
            'momentum': momentum,
            'topology': topology,
        },
        'plot_data': {'val': plot_v, 'train': plot_train},
    }
