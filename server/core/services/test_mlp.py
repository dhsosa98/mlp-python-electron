
import os
import numpy as np
from ..utils.load_datasets import load_datasets
from ..utils.split_datasets import splitDatasets
from ..utils.functions import cost
from fastapi import FastAPI, HTTPException
from .crud import get_savedModel


# Definimos la funcion para testear el modelo
def test_mlp_model(model, model_type, val_percentage):
    datasets = {
        'model100': '../datasets/letras_distorsionadas100.csv',
        'model500': '../datasets/letras_distorsionadas500.csv',
        'model1000': '../datasets/letras_distorsionadas1000.csv'
    }

    # Definimos el path del dataset
    path = os.path.dirname(__file__)+'/'+datasets[model_type]

    # Si el dataset no existe, lanzamos un error
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    # Obtenemos el dataset
    data = load_datasets(path)

    data = np.array(data)

    # Obtenemos los datos de test
    X_test, Y_test = splitDatasets(data, val_percentage, True)

    # Obtenemos el modelo guardado
    saved_model = get_savedModel(model)

    # Si el modelo no existe, lanzamos un error
    if not saved_model:
        raise HTTPException(status_code=404, detail="Model not found")

    # Obtenemos el resultado de la prediccion
    result_test = saved_model.predict(X_test, Y_test)


    # Obtenemos el historial de entrenamiento
    history = saved_model.history

    # Obtenemos la prediccion
    prediction_test = saved_model.get_prediction(result_test)

    # Retornamos el resultado de test, el historial de entrenamiento y la data para graficar
    return {
        'data': {
            'model_name': model,
            'accuracy_test': round(saved_model.get_accuracy(prediction_test, Y_test), 8),
            'MSE_test': round(cost(result_test, Y_test), 8),
            'test_cases': len(Y_test),
        },
        'plot_data': saved_model.plot_data,
        'history': history
    }
