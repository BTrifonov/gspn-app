from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware 

from pydantic import BaseModel
from pathlib import Path

#Problems when importing without the dot
from .readWriteJSON import write_model_file, delete_model_file

import json
import os

#Source/Target attribute of custom.Arc
#TODO Does not work when the arc is created from the DrawMenu
class SourceTarget(BaseModel):
    id: str | None = None
    x: int | None = None
    y: int | None = None

#Relevant attributes of (custom.Place, custom.Transition, custom.Arc)
class Cell(BaseModel):
    id: str
    type: str
    attrs: dict
    source: SourceTarget | None = None
    target: SourceTarget | None = None

class Model(BaseModel):
    cells: list[Cell] | None = None

class ReqBody(BaseModel):
    model: Model

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




#API points

#GET methods

@app.get("/")
async def main():
    return {
        "message": "Hello World"
    }

#----------------------------------------------------------------

#POST methods

@app.post("/model")
async def saveModel(req_body: ReqBody):
    """Saves the model locally to the model directory as a JSON"""
    write_model_file(req_body.model)


#----------------------------------------------------------------

#DELETE methods

@app.delete("/model")
async def deleteModel():
    delete_model_file()
