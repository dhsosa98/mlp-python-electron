
import os
import numpy as np
from ..utils.load_datasets import load_datasets
from ..utils.split_datasets import splitDatasets
from ..utils.functions import cost
from fastapi import FastAPI, HTTPException
from .crud import get_savedModel


# Definimos la funcion para testear el modelo
def test_mlp_model(saved_model):
  
    # Obtenemos el historial de entrenamiento y test
    history = saved_model.history

    # Retornamos el resultado de test, el historial de entrenamiento y test, y la data para graficar
    return {
        'plot_data': saved_model.plot_data,
        'history': history
    }
