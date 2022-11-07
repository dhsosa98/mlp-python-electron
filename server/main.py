import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import sys
from core.api.main import app

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def serve():
    """Serve the web application."""
    if getattr(sys, 'frozen', False):
        uvicorn.run(app)
    else:
        uvicorn.run('main:app', reload=True, port=8000)


if __name__ == "__main__":
    serve()
