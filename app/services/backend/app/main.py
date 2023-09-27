from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware 

from pydantic import BaseModel

import urllib.parse
#---------------------------------------------------
import asyncio
#---------------------------------------------------
#TODO Problems with the relative import
from .file_utils import write_file, get_file, delete_file, file_exists, delete_all_files
from .websocket_communication import handle_websocket_communication


#from .model_alternativ import Model
from .model_proxy import ModelProxy

import json


#All attributes required when transferring object
#TODO: Read FastAPI, surely there is a better approach to pass query param
class Param(BaseModel):
    name: str | None = None
    transition_id: str | None = None

class ParameterClass(BaseModel):
    params: Param

class PlainJSON(BaseModel):
    data: dict | None = None
    params: Param | None = None


app = FastAPI()

#Allow all origins for now
#origins = [
#    "https://csl.bpm.",
#]


# NEW
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#---------------------------------------------------------
#Try to create and serve a websocket for the simulation of PNs
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()   
    await handle_websocket_communication(websocket)      

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
    Includes styling, required for rendering the model back in the frontend
    """

    plain_json_file = get_file(name)
    return plain_json_file

@app.post("/model/enabled-transitions")
async def get_enabled_transitions(req_body: PlainJSON):
    """
    Return the id's of all enabled transitions
    """ 
    plain_json_file = req_body.data   
    
    model = ModelProxy(plain_json_file['model'])
    
    result = model.find_enabled_transitions()
    return result
#----------------------------------------------------------------

#POST methods

@app.post("/model")
async def save_model(req_body: PlainJSON):
    """
    Save the plain json model
    Includes styling, required for rendering the model in the frontend at a later point in time
    """
    plain_json_file = json.dumps(req_body.data, indent=4)
    write_file(plain_json_file, req_body.params.name)


@app.post("/model/fire-transition")
async def fire_transition(req_body: PlainJSON):
    """
    Fire a transition of the plain json model
    """
    transition_id = req_body.params.transition_id

    plain_json_file = req_body.data

    model = ModelProxy(plain_json_file['model'])
    result = model.fire_transition(transition_id)
    
    return result

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

@app.delete("/models")
async def delete_all_models():
    delete_all_files()


@app.delete("/model")
async def delete_model(name: str):
    """
    Delete the plain json model
    """
    file_name = name
    delete_file(file_name)
