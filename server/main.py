from typing import Any
import uvicorn


from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from core import shuffle, mlp_answer

class Matrix(BaseModel):
    matrix: Any
    distortion: int

class Matrix_A(BaseModel):
    matrix: Any

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
def read_item(matrix: Matrix):
    return shuffle(matrix.matrix, matrix.distortion)


@app.post("/mlp_answer")
def update_item(matrix: Matrix_A):
    return mlp_answer(matrix)


def serve():
    """Serve the web application."""
    uvicorn.run(app)

if __name__ == "__main__":
    serve()