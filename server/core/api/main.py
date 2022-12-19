from fastapi import HTTPException
from fastapi import FastAPI
from typing import Any, Optional
from pydantic import BaseModel
from ..services.train_mlp import train_mlp_model
from ..services.prediction import prediction
from ..services.crud import list_savedModels, delete_savedModel, get_savedModel, get_savedModelAttr
from ..utils.shuffle_matrix import shuffle_matrix
from ..datasets.generate_datasets import generate_dataset
from ..services.test_mlp import test_mlp_model
from ..datasets.generate_datasets import available_letters
from ..services.generate_simulations import generate_simulations

app = FastAPI()

class Distort_Matrix(BaseModel):
    matrix: Any
    distortion: int

class Get_Prediction(BaseModel):
    matrix: Any
    model: str


class Train_Model(BaseModel):
    amount_datasets: Optional[int] = 1000
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

class Model_Attr(BaseModel):
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
    saved_model = get_savedModel(model.model)
    if not saved_model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    return test_mlp_model(saved_model)


@app.post("/train_model")
def train_model(model: Train_Model):
    print(model)
    if (model.epochs < 1):
        raise HTTPException(
            status_code=400, detail="Epoch must be greater than 0")

    return train_mlp_model(model.lr, model.momentum, model.epochs, model.hl_topology, model.val_percentage, model.save, model.amount_datasets, model.name)


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

@app.post("/model_attr")
def get_model_attr(model: Model_Attr):
    saved_model = get_savedModel(model.model)
    if not saved_model:
        raise HTTPException(status_code=404, detail="Model not found")
    return get_savedModelAttr(saved_model)

@app.get("/default_matrixes")
def get_default_matrixes():
    return {
        'default_matrixes': available_letters
    }

@app.post("/generate_simulations")
def post_generate_simulations():
    return generate_simulations()