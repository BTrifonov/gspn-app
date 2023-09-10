from pathlib import Path

import json

#Write the PN model to a local file with file_name
def parse_model(model_data, file_name):
    """Doc of the function"""
    try:
        current_dir_path = Path.cwd()
        model_dir_path = current_dir_path / "models" 

        
        model_file_path = model_dir_path / file_name
        elements = {}
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

        elements['places'] = places
        elements['transitions'] = transitions
        elements['arcs'] = arcs

        #Write the array of json cells to a file
        with open(model_file_path, "w") as file:
           file.write(json.dumps(elements, indent=4))
        
        #Instead of saving the new dictionary, return it
        return elements

    except OSError as e:
        print(f"The following error occurred: {e}")



#Relevant attributes of a place: id, token number
def parse_place(cell):
    """Doc of the function"""
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

#Relevant attributes of transition: id, tokenDistribution, rate
def parse_transition(cell):
    """Doc of the function"""
    transition = {}

    #Extract the id
    transition['id'] = cell['id']

    #Extract the attrs
    transition_attrs = cell['attrs']

    #Extract token distribution and rate
    transition_distribution_attrs = transition_attrs["tokenDistribution"]
    transition_distribution_type = transition_distribution_attrs["distribution"]
    transition_rate = transition_distribution_attrs["rate"]

    transition['distribution_type'] = transition_distribution_type
    transition['rate'] = transition_rate

    return transition

#Relevant attributes of arc: id, source, target
def parse_arc(cell):
    """Doc of the function"""
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
