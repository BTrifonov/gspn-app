from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware 

from pydantic import BaseModel

#---------------------------------------------------
import asyncio
#---------------------------------------------------



#Problems with the relative import
from .file_utils import write_file, get_file, delete_file, file_exists

from .model_utils import parse_model
from .create_incidence_matrix import create_matrix, get_place_marking, determine_enabled_transitions
from .model import Model

import json


#All attributes required when transferring object
#TODO: Read FastAPI, surely there is a better approach to pass query param
class Param(BaseModel):
    name: str
    transition_id: str | None = None

class ParameterClass(BaseModel):
    params: Param

class PlainJSON(BaseModel):
    data: dict | None = None
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


#---------------------------------------------------------
#Try to create and serve a websocket for the simulation of PNs
@app.websocket("/ws/{websocket_id}")
async def websocket_endpoint(websocket: WebSocket, websocket_id: int):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message text was: {data}")


#---------------------------------------------------------
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
    Return the id's of all enabled transitions
    """    
    plain_json_file = get_file(name)

    #Deserialize to a python dict
    model_dict = json.loads(plain_json_file)
    model_parsed = parse_model(model_dict['model'])
    
    #Save the model, before working with it
    write_file(json.dumps(model_parsed, indent=4), name.removesuffix('.json') + "-parsed.json")

    model = Model(model_parsed)
    enabled_transitions = model.determine_enabled_transitions()
    print(enabled_transitions)
    return enabled_transitions
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


@app.post("/model/fire-transition")
async def fire_transition(req_body: PlainJSON):
    """
    Fire a transition of the plain json model
    """
    file_name = req_body.params.name
    transition_id = req_body.params.transition_id

    plain_json_file = get_file(file_name)

    #Deserialize to a python dictionary
    model_dict = json.loads(plain_json_file)
    model_parsed = parse_model(model_dict['model'])

    model = Model(model_parsed)

    return model.fire_transition(transition_id)

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
