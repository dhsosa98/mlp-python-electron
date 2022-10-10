from typing import Any, Optional
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from m_core import shuffle, mlp_answer
from core.models import trainModelA, trainModelB, trainModelC
from api.main import list_savedModels
from core.datasets.generate import generate_dataset
import sys

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
    epoch: Optional[int] = 20
    hl_topology: Optional[list[int]] = [5]
    act_f: Optional[str] = 'lineal' #lineal or sigm

class GenerateDataset(BaseModel):
    type: str

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
    if generateDataset.type == 'A':
        generate_dataset(100)
    elif generateDataset.type == 'B':
        generate_dataset(500)
    else:
        generate_dataset(1000)
    return {
        'message': 'Dataset generated'
    }



@app.post("/train_model")
def train_model(model: Model):
    if model.type == "A":
        return trainModelA(model.lr, model.momentum, model.epoch, model.hl_topology, model.act_f)
    elif model.type == "B":
        return trainModelB(model.lr, model.momentum, model.epoch, model.hl_topology, model.act_f)
    else:
        return trainModelC(model.lr, model.momentum, model.epoch, model.hl_topology, model.act_f)

@app.post("/distortion_matrix")
def distortion_matrix(matrix: Matrix):
    return shuffle(matrix.matrix, matrix.distortion)


@app.post("/mlp_answer")
def get_mlp_answer(predict: GetPredict):
    return mlp_answer(predict.matrix, predict.model)


def serve():
    """Serve the web application."""
    if getattr(sys, 'frozen', False):
        uvicorn.run(app)
    else:
        uvicorn.run('main:app', reload=True, port=8000)

if __name__ == "__main__":
    serve()