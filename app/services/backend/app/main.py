from fastapi import FastAPI, Header

from fastapi.middleware.cors import CORSMiddleware 

from pydantic import BaseModel

from pathlib import Path

import json
import os


class PetriNetModel(BaseModel):
    model: dict


app = FastAPI()

origins = [
    "http://localhost:5173"
]


# NEW
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
async def main():
    return {
        "message": "Hello World"
    }

@app.get("/usr")
async def func():
    return {
        "message": "Vamos"
    }

@app.post("/model")
async def printJSONModel(req_body: PetriNetModel):
    current_directory = os.path.dirname(os.path.abspath(__file__))
    relative_path = os.path.join(current_directory, "tempModels", "model.json")
    path = Path(relative_path)
    content = json.dumps(req_body.model)
    path.write_text(content)
    print(req_body.model)
