from typing import Any
import uvicorn
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from m_core import shuffle, mlp_answer


class Matrix(BaseModel):
    matrix: Any
    distortion: int

class Matrix_A(BaseModel):
    matrix: Any
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

@app.post("/distortion_matrix")
def distortion_matrix(matrix: Matrix):
    return shuffle(matrix.matrix, matrix.distortion)


@app.post("/mlp_answer")
def get_mlp_answer(matrix: Matrix_A):
    return mlp_answer(matrix.matrix, matrix.model)


def serve():
    """Serve the web application."""
    uvicorn.run(app, port=8000)

if __name__ == "__main__":
    serve()