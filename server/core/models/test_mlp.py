
import os
import numpy as np
from ..utils.util import loadDatasets, splitIntoValidationDataset, splitIntoTestingDataset 
from ..utils.functions import cost
from fastapi import FastAPI, HTTPException
from ..api.main import get_savedModel


def test(model, model_type, val_percentage):
    datasets = {
        'model100': '../datasets/letras_distorsionadas100.csv',
        'model500': '../datasets/letras_distorsionadas500.csv',
        'model1000': '../datasets/letras_distorsionadas1000.csv'
    }

    path = os.path.dirname(__file__)+'/'+datasets[model_type]
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    n=102

    data = loadDatasets(path)

    data = np.array(data)

    _x, _y, data_et = splitIntoValidationDataset(data, n, val_percentage)
    X_test, Y_test = splitIntoTestingDataset(data_et, n)

    saved_model = get_savedModel(model)

    if not saved_model:
        raise HTTPException(status_code=404, detail="Model not found")

    result_t = saved_model.predict(X_test, Y_test)

    prediction_t = saved_model.get_prediction(result_t)
    return {
        'data': {
            'model_name': model,
            'accuracy_test': round(saved_model.accuracy(prediction_t, Y_test), 2),
            'MSE_test': round(cost(result_t, Y_test), 2),
            'test_cases': len(Y_test),
        },
        'plot_data': saved_model.plot_data,
  }