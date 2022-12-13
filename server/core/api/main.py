from http.client import HTTPException
from fastapi import FastAPI
from typing import Any, Optional
from pydantic import BaseModel
from ..services.train_mlp import train_mlp_model
from ..services.prediction import prediction
from ..services.crud import list_savedModels, delete_savedModel, get_savedModel, get_savedModelAttr
from ..utils.shuffle_matrix import shuffle_matrix
from ..datasets.generate_datasets import generate_dataset
from ..services.test_mlp import test_mlp_model

app = FastAPI()

class Distort_Matrix(BaseModel):
    matrix: Any
    distortion: int

class Get_Prediction(BaseModel):
    matrix: Any
    model: str


class Train_Model(BaseModel):
    type: str
    lr: Optional[float] = 0.5
    momentum: Optional[float] = 0.5
    epochs: Optional[int] = 20
    hl_topology: Optional[Any] = [5]
    val_percentage: Optional[float] = 0.3
    save: Optional[bool] = False
    name: Optional[str] = None


class Generate_Dataset(BaseModel):
    type: str


class Delete_Model(BaseModel):
    model: str

class Test_Model(BaseModel):
    model: str


@app.get("/")
def root():
    return {"Hello": "World"}


@app.get('/models')
def get_models():
    return {
        'models': list_savedModels()
    }


@app.post('/generate_datasets')
def generate_datasets(data: Generate_Dataset):
    isGenerated = False
    if data.type == 'A':
        isGenerated = generate_dataset(100)
    elif data.type == 'B':
        isGenerated = generate_dataset(500)
    else:
        isGenerated = generate_dataset(1000)
    if not isGenerated:
        raise HTTPException(status_code=404, detail="Dataset type " +
                        generate_dataset.type+" not found")
    return {
        'message': 'Dataset type '+data.type+' successfully generated'
    }



@app.post("/test_model")
def test_model(model: Test_Model):
    atrr = get_savedModelAttr(model.model)
    saved_model = get_savedModel(model.model)
    if not saved_model:
        raise HTTPException(status_code=404, detail="Model not found")

    if (atrr['val_percentage'] and atrr['model_name']):
        return test_mlp_model(model.model, atrr['model_name'], atrr['val_percentage'])
    
    return test_mlp_model(model.model, saved_model.model_name, saved_model.val_percentage, saved_model.dataset_type)


@app.post("/train_model")
def train_model(model: Train_Model):
    if model.epochs < 1:
        raise HTTPException(
            status_code=400, detail="Epoch must be greater than 0")

    dataset = ''
    if model.type == 'A':
        dataset = 'letras_distorsionadas100.csv'
    elif model.type == 'B':
        dataset = 'letras_distorsionadas500.csv'
    else:
        dataset = 'letras_distorsionadas1000.csv'
    return train_mlp_model(model.lr, model.momentum, model.epochs, model.hl_topology, model.val_percentage, model.save, dataset, model.name)


@app.post("/distort_matrix")
def distortion_matrix(matrix: Distort_Matrix):
    return shuffle_matrix(matrix.matrix, matrix.distortion)


@app.post("/prediction")
def get_prediction(predict: Get_Prediction):
    return prediction(predict.matrix, predict.model)


@app.post("/delete_model")
def delete_model(model: Delete_Model):
    isDeleted = delete_savedModel(model.model)
    if not isDeleted:
        raise HTTPException(status_code=404, detail="Model not found")
    return {
            'message': 'Model deleted'
        }   
