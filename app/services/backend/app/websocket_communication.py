from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import json

from .model_proxy import ModelProxy

from .exceptions.invalid_sender_receiver_field import InvalidSenderReceiverField
from .exceptions.invalid_action_field import InvalidActionField
from .exceptions.invalid_status_field import InvalidStatusField

async def handle_websocket_communication_alternate(websocket: WebSocket, socket_id: int):
    try:
        model_proxy = None
        while True:
            incoming_msg_json = await websocket.receive_text()
            incoming_msg = json.loads(incoming_msg_json)

            if incoming_msg['action'] == "create_model":
                #model = instantiate_model(incoming_msg['data'])
                model_proxy = ModelProxy(incoming_msg['data'])
                outgoing_msg = create_msg("backend", "frontend", "model_created", "ok", "")
                outgoing_msg_json = json.dumps(outgoing_msg)
                await websocket.send_text(outgoing_msg_json)


            if incoming_msg['action'] == "sim":
                data = incoming_msg['data']
                sim_step = data['sim_step']

                if not sim_step:
                    outgoing_msg = simulation_request(model_proxy)
                
                #outgoing_msg = await simulate_model(model, sim_step)
                
                outgoing_msg_json = json.dumps(outgoing_msg)
                await websocket.send_text(outgoing_msg_json)
             

            if incoming_msg['action'] == "unselect_model":
                continue

            if incoming_msg['action'] == "pause_sim":
                continue
                    
                        
    except WebSocketDisconnect as e:
        if e.code == 1000:
            print("WebSocket closed gracefully")
        else:
            print(f"WebSocket closed with code {e.code}")

#-----------------------------------------------------------
#Actions, based on the sent/received msg
#-----------------------------------------------------------
def instantiate_model(msg_payload):
    msg_payload = parse_model(msg_payload)
    model = Model(msg_payload)
    return model

def simulation_request(model_proxy: ModelProxy):
    
    sim_result = model_proxy.sim_iteration()

    response_msg = {
        'sender': 'backend', 
        'receiver': 'frontend',
        'input_places': sim_result['input_places'], 
        'output_places': sim_result['output_places'], 
        'transition_id': sim_result['transition_id'],

        'delay': sim_result['delay'],
        'status': 'ok'
    }
    
    if sim_result['continue_sim']:
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




#-----------------------------------------------------------
#Internal helper methods, used only in this file
#-----------------------------------------------------------
def create_msg(sender_data, receiver_data, action_data, status_data, content_data):
    msg = {
        'sender': sender_data,
        'receiver': receiver_data,
        'action': action_data, 
        'status': status_data,
        'data': content_data
    }

    return msg


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

