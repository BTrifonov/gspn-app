from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 

from pydantic import BaseModel


#Problems with the relative import
from .file_utils import write_file, get_file, delete_file, file_exists

from .model_utils import parse_model
from .create_incidence_matrix import create_matrix, get_place_marking, determine_enabled_transitions

import json

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


#API endpoints

#GET methods

@app.get("/")
async def main():
    return {
        "message": "Hello World"
    }

@app.get("/model")
async def get_model(name: str):
    """
    Retrieve the plain json model
    Includes styling, required for rendering the model
    """

    plain_json_file = get_file(name)
    return plain_json_file

@app.get("/model/enabled-transitions")
async def get_enabled_transitions(name: str):
    """
    Return all enabled transitions
    """
    
    plain_json_file = get_file(name)

    #Deserialize to a python object
    file = json.loads(plain_json_file)

    model = parse_model(model_data=file['model'])
    
    #Save the model
    write_file(json.dumps(model, indent=4), name.removesuffix('.json') + "-parsed.json")
    
    matrix = create_matrix(model)
    marking = get_place_marking(model)

    enabled_transitions = determine_enabled_transitions(matrix, marking)
    print(matrix)
    print(marking)
    print(enabled_transitions)

#----------------------------------------------------------------

#POST methods

@app.post("/model")
async def save_model(req_body: PlainJSON):
    """
    Save the plain json model
    Includes styling, required for rendering the model
    """
    plain_json_file = json.dumps(req_body.data, indent=4)
    write_file(plain_json_file, req_body.params.name)


#----------------------------------------------------------------

# PUT methods

@app.put("/model")
async def update_model(req_body: PlainJSON):
    """
    Save the plain json model
    Includes styling, required for rendering the model
    """
    model_name = req_body.params.name
    plain_json_file_exists = file_exists(model_name)

    if(plain_json_file_exists):
        plain_json_file = json.dumps(req_body.data, indent=4)
        write_file(plain_json_file, model_name)
    else:
        raise FileNotFoundError("File with name: " + model_name + " not found for update")
  
#----------------------------------------------------------------

#DELETE methods

@app.delete("/model")
async def delete_model(name: str):
    """
    Delete the plain json model
    """
    file_name = name
    delete_file(file_name)
