from typing import Any, Optional
import uvicorn
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from m_core import shuffle, mlp_answer
from core.models import trainModelA, trainModelB, trainModelC


class Matrix(BaseModel):
    matrix: Optional[list[int]]
    distortion: int

class Matrix_A(BaseModel):
    matrix: Optional[list[int]]
    model: str

class Model(BaseModel):
    type: str
    lr: Optional[float] = 0.5
    momentum: Optional[float] = 0.5
    epoch: Optional[int] = 20
    hl_topology: Optional[list[int]] = [5]
    act_f: Optional[str] = 'lineal' #lineal or sigm

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
def get_mlp_answer(matrix: Matrix_A):
    return mlp_answer(matrix.matrix, matrix.model)


def serve():
    """Serve the web application."""
    uvicorn.run('main:app', port=8001, host='127.0.0.1', reload=True)

if __name__ == "__main__":
    serve()