from pathlib import Path
import json
from .file_utils import write_file


#---------------------------------------------------------
# Functions responsible for extracting model information
# from the plain json object
#---------------------------------------------------------
def parse_model(model_data):
    """
    Extract only attributes relevant for the simulation from the plain_json_file
    Save the model as json in the '/models' dir
    """    
    model = {}
    places = []
    transitions = []
    arcs = []

    #Transform each cell into json format
    for cell in model_data['cells']:
        element_type = cell['type']

        if(element_type == 'custom.Place'): 
            place_dict = parse_place(cell=cell)
            places.append(place_dict)
                
        elif(element_type == 'custom.Transition'):
            transition_dict = parse_transition(cell=cell)
            transitions.append(transition_dict)
                
        elif(element_type == 'standard.Link'):
            arc_dict = parse_arc(cell=cell)
            arcs.append(arc_dict)

    model['places'] = places
    model['transitions'] = transitions
    model['arcs'] = arcs

    #For test purposes save data locally
    write_file(data=json.dumps(model, indent=4), file_name="model-parsed.json")

    return model

def parse_place(cell):
    """
    Retrieve relevant place attributes for a simulation
    For now: id and token number
    """
    place = {}
    
    #Extract the attrs
    place_attrs = cell['attrs']

    #Extract the id
    place['id'] = cell['id']

    #Extract the token number
    token_attrs = place_attrs['tokenNumber']
    token_number = token_attrs['text']
    place['token_number'] = token_number

    return place

def parse_transition(cell):
    """
    Retrieve relevant transition attributes for a simulation
    For now: id, distribution, rate
    """
    transition = {}

    #Extract the id
    transition['id'] = cell['id']

    #Extract the attrs
    #transition_attrs = cell['attrs']

    #Determine the transition type -> immediate or timed
    transition['timed'] = cell['timed']

    if transition['timed']:
        #Extract token distribution and rate if timed transition
        transition['distribution_type'] = cell['tokenDistribution']
        transition['rate'] = cell['rate']

    return transition

def parse_arc(cell):
    """
    Retrieve relevant arc attributes for simulation
    For now: id, source, target
    """
    arc = {}

    #Extract the id
    arc['id'] = cell['id']

    #Extract the source id
    arc_source = cell['source']
    arc_source_id = arc_source['id']
    arc['source'] = arc_source_id

    #Extract the target id
    arc_target = cell['target']
    arc_target_id = arc_target['id']
    arc['target'] = arc_target_id

    return arc


