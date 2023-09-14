from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json

from .model import Model
from .model_utils import parse_model

from .exceptions.invalid_sender_receiver_field import InvalidSenderReceiverField
from .exceptions.invalid_action_field import InvalidActionField
from .exceptions.invalid_status_field import InvalidStatusField

async def handle_websocket_communication_alternate(websocket: WebSocket, socket_id: int):
    try:
        while True:
            incoming_msg_json = await websocket.receive_text()
            incoming_msg = json.loads(incoming_msg_json)

            if incoming_msg['action'] == "instantiate_model":
                model = instantiateModel(incoming_msg['data'])

            if incoming_msg['action'] == "unselect_model":
                continue

            if incoming_msg['action'] == "start_sim":
                outgoing_msg = await fireTransition(model)
                outgoing_msg_json = json.dumps(outgoing_msg)
                await websocket.send_text(outgoing_msg_json)

    
            if incoming_msg['action'] == "continue_sim":
                    continue_allowed = check_flags(incoming_msg['flags'])

                    if continue_allowed:
                        outgoing_msg = await fireTransition(model)
                        outgoing_msg_json = json.dumps(outgoing_msg)
                        await websocket.send_text(outgoing_msg_json)
                    
                        
    except WebSocketDisconnect:
        print("Websocket disconnected")

#-----------------------------------------------------------
#Actions, based on the sent/received msg
#TODO:Move to another file later
#-----------------------------------------------------------
def instantiateModel(msg_payload):
    msg_payload = parse_model(msg_payload)
    model = Model(msg_payload)
    return model

async def fireTransition(model: Model):
    result_fired_transition = await model.sim_fire_transition()

    response_msg = {
        'sender': 'backend', 
        'receiver': 'frontend',
        'input_places': result_fired_transition['input_places'], 
        'output_places': result_fired_transition['output_places'], 
        'transition_id': result_fired_transition['transition_id'],
        'status': 'ok'
    }

    if result_fired_transition['enabled_transitions']:
        response_msg['action'] = "visualize_fired_transition"
    else:
        response_msg['action'] = "end_sim"

    return response_msg

def create_msg(sender_data, receiver_data, action_data, status_data, content_data):
    msg = {
        'sender': sender_data,
        'receiver': receiver_data,
        'action': action_data, 
        'status': status_data,
        'data': content_data
    }

    return msg

def check_flags(flags):
    for flag in flags:
        for key, value in flag.items():
            if key == "stop":
                if value:
                    print("Stop requested!")
                    return False
                elif not value:
                    return True

#-----------------------------------------------------------
#Internal helper methods, used only in this file
#-----------------------------------------------------------
def perform_msg_checks(msg, incoming):
    if(incoming):
        check_sender_receiver_incoming_msg(msg['sender'], msg['receiver'])
    else:
        check_sender_receiver_outgoing_msg(msg['sender'], msg['receiver'])


    check_action(msg['sender'], msg['action'])
    #check_status(msg['status'])

def check_sender_receiver_incoming_msg(sender, receiver):
    """
    Check the validity of the sender/receiver field
    """
    if(sender != "frontend"):
        raise InvalidSenderReceiverField("Sender field of an incoming msg to backend is incorrect")
    
    if(receiver != "backend"):
        raise InvalidSenderReceiverField("Receiver field of an incoming msg to backend is incorrect")

def check_sender_receiver_outgoing_msg(sender, receiver):
    if(sender != "backend"):
        raise InvalidSenderReceiverField("Sender field of an outgoing msg to frontend is incorrect")

    if(receiver != "frontend"):
        raise InvalidSenderReceiverField("Receiver field of an outgoing msg to frontend is incorrect")

def check_action(sender, action):
    """
    Check the validity of the action field, based on the sender field
    """
    allowed_backend_actions = ["visualize_fired_transition", "end_sim", "response"]
    allowed_frontend_actions = ["instantiate_model", "unselect_model", "start_sim", "pause_sim", "restart_sim", "rewind_to_start_sim", "rewind_to_end_sim", "continue_sim", "response"]

    if(sender == "backend"):
        if action not in allowed_backend_actions:
            raise InvalidActionField("Action field of an outgoing msg to frontend is incorrect")
    elif(sender == "frontend"):
        if action not in allowed_frontend_actions:
            raise InvalidActionField("Action field of an incoming msg to backend is incorrect")

def check_status(status):
    """
    Check the validity of the status field
    """
    if(status != "ok" and status != "fail"):
        raise InvalidStatusField("Status field is not correct")

