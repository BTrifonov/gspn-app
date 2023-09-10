from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware 

from pydantic import BaseModel
from pathlib import Path


from fastapi.responses import JSONResponse

#Problems when importing without the dot
from .read_write_JSON import delete_model_file, write_file, get_model_file, model_file_exists

from .parse_model import parse_model
from .create_incidence_matrix import create_matrix, get_place_marking, determine_enabled_transitions

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


#All attributes required when transferring object
#TODO: Read FastAPI, surely there is a better approach to pass query param
class Param(BaseModel):
    name: str

class ParameterClass(BaseModel):
    params: Param

class PlainJSON(BaseModel):
    data: dict
    params: Param


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

@app.get("/model")
async def get_model(name: str):
    """Doc of the API point"""
    model_file = get_model_file(file_name=name)
    json_file = json.loads(model_file)
    return model_file

@app.get("/model/enabled-transitions")
async def get_enabled_transitions(name: str):
    model_file = get_model_file(file_name=name)
    json_file = json.loads(model_file)

    elements = parse_model(model_data=json_file['model'], file_name=name.removesuffix('.json') + "-parsed.json")
    matrix = create_matrix(elements=elements)
    marking = get_place_marking(elements=elements)

    enabled_transitions = determine_enabled_transitions(matrix, marking)
    print(matrix)
    print(marking)
    print(enabled_transitions)

#----------------------------------------------------------------

#POST methods

@app.post("/model")
async def save_model(req_body: PlainJSON):
    """Doc of the API point"""
    json_file = json.dumps(req_body.data, indent=4)
    write_file(json_file, file_name = req_body.params.name)


#----------------------------------------------------------------

# PUT methods

@app.put("/model")
async def update_model(req_body: PlainJSON):
    """Doc of the API point"""
    model_name = req_body.params.name
    model_exists = model_file_exists(model_name)

    if(model_exists):
        json_file = json.dumps(req_body.data, indent=4)
        write_file(model_data= json_file, file_name = model_name)
    else:
        raise FileNotFoundError("File with name: " + model_name + " not found for update")

    
#----------------------------------------------------------------

#DELETE methods

@app.delete("/model")
async def delete_model(name: str):
    """Doc of the API point"""
    model_name = name
    delete_model_file(model_name)
