from typing import Any, Optional
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from core.models import trainModel
from core.api.main import list_savedModels, delete_savedModel, get_savedModelAttr, shuffle, mlp_answer
from core.datasets.generate import generate_dataset
from core.models.test_mlp import test
import sys


class Matrix(BaseModel):
    matrix: Any
    distortion: int


class GetPredict(BaseModel):
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
            'message': 'Dataset type '+generateDataset.type+' successfully generated'
        }
    raise HTTPException(status_code=404, detail="Dataset type " +
                        generateDataset.type+" not found")


@app.post("/test_model")
def test_model(model: TestModel):
    atrr = get_savedModelAttr(model.model)
    print(atrr)
    if not atrr:
        raise HTTPException(status_code=404, detail="Model not found")
    if atrr['val_percentage'] and atrr['model_name']:
        return test(model.model, atrr['model_name'], atrr['val_percentage'])


@app.post("/train_model")
def train_model(model: Train_Model):
    dataset = ''
    if model.type == 'A':
        dataset = 'letras_distorsionadas100.csv'
    elif model.type == 'B':
        dataset = 'letras_distorsionadas500.csv'
    else:
        dataset = 'letras_distorsionadas1000.csv'
    return trainModel(model.lr, model.momentum, model.epochs, model.hl_topology, model.val_percentage, model.save, dataset)


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
    raise HTTPException(status_code=404, detail="Model not found")


def serve():
    """Serve the web application."""
    if getattr(sys, 'frozen', False):
        uvicorn.run(app)
    else:
        uvicorn.run('main:app', reload=True, port=8000)


if __name__ == "__main__":
    serve()
