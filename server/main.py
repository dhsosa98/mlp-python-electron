from typing import Any, Optional
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from m_core import shuffle, mlp_answer
from core.models import trainModelA, trainModelB, trainModelC
from api.main import list_savedModels, delete_savedModel, get_savedModelAttr, get_savedModel
from core.datasets.generate import generate_dataset
import sys
import os

from core.entities.neural_network import neural_network
from core.utils.functions import cost
from core.utils.util import loadDatasets, splitIntoValidationDataset, splitIntoTestingDataset, splitIntoTrainingDataset
import numpy as np

class Matrix(BaseModel):
    matrix: Any
    distortion: int

class GetPredict(BaseModel):
    matrix: Any
    model: str

class Model(BaseModel):
    type: str
    lr: Optional[float] = 0.5
    momentum: Optional[float] = 0.5
    epochs: Optional[int] = 20
    hl_topology: Optional[list[int]] = [5]
    val_percentage: Optional[float] = 0.3
    save: Optional[bool] = False

class GenerateDataset(BaseModel):
    type: str

class DeleteModel(BaseModel):
    model: str

class TestModel(BaseModel):
    model: str

origins = [
    "http://localhost",
    "https://localhost",
    "http://localhost:9000",
    "http://localhost:3000",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"Hello": "World"}

@app.get('/models')
def get_models(): 
        return {
        'models': list_savedModels()
    }

@app.post('/generate_datasets')
def generate_datasets(generateDataset: GenerateDataset):
    isGenerated = False
    if generateDataset.type == 'A':
        isGenerated = generate_dataset(100)
    elif generateDataset.type == 'B':
        isGenerated = generate_dataset(500)
    else:
        isGenerated = generate_dataset(1000)
    if isGenerated:
        return {
            'message': 'Dataset type '+generateDataset.type+' generated'
        }
    return {
        'message': 'Dataset not generated'
    }

@app.post("/test_model")
def test_model(model: TestModel):
    atrr = get_savedModelAttr(model.model)
    if not atrr:
        return {
            'message': 'Model not found'
        }
    if atrr['val_percentage'] and atrr['model_name']:
        return train(model.model, atrr['model_name'], atrr['val_percentage'])

def train(model, model_type, val_percentage):
    datasets = {
        'model100': 'datasets/letras_distorsionadas100.csv',
        'model500': 'datasets/letras_distorsionadas500.csv',
        'model1000': 'datasets/letras_distorsionadas1000.csv'
    }

    path = os.path.dirname(__file__)+'/core/'+datasets[model_type]
    if not os.path.isfile(path):
        return {
            'message': 'Dataset not found'
        }

    n=102

    data = loadDatasets(path)

    data = np.array(data)

    _x, _y, data_et = splitIntoValidationDataset(data, n, val_percentage)
    X_test, Y_test = splitIntoTestingDataset(data_et, n)

    saved_model = get_savedModel(model)

    if not saved_model:
        return {
            'message': 'Model not found'
        }

    result_t = saved_model.train(X_test, Y_test, False)

    prediction_t = neural_network.get_prediction('', result_t)
    return {
        'model_name': model,
        'accuracy_test': round(neural_network.accuracy('', prediction_t, Y_test), 2),
        'MSE_test': round(cost(result_t, Y_test), 2),
        'test_cases': len(Y_test),
  }
        
    


    

@app.post("/train_model")
def train_model(model: Model):
    if model.type == 'A':
        return trainModelA(model.lr, model.momentum, model.epochs, model.hl_topology, model.val_percentage, model.save)
    elif model.type == 'B':
        return trainModelB(model.lr, model.momentum, model.epochs, model.hl_topology, model.val_percentage, model.save)
    else:
        return trainModelC(model.lr, model.momentum, model.epochs, model.hl_topology, model.val_percentage, model.save)
    
@app.post("/distortion_matrix")
def distortion_matrix(matrix: Matrix):
    return shuffle(matrix.matrix, matrix.distortion)


@app.post("/mlp_answer")
def get_mlp_answer(predict: GetPredict):
    return mlp_answer(predict.matrix, predict.model)


@app.post("/delete_model")
def delete_model(model: DeleteModel):
    isDeleted = delete_savedModel(model.model)
    if isDeleted:
        return {
            'message': 'Model deleted'
        }
    return {
        'message': 'Model not found'
    }


def serve():
    """Serve the web application."""
    if getattr(sys, 'frozen', False):
        uvicorn.run(app)
    else:
        uvicorn.run('main:app', reload=True, port=8000)

if __name__ == "__main__":
    serve()