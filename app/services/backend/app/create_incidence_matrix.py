


def create_matrix(elements):
    """Doc of the function"""
    places = elements['places']
    transitions = elements['transitions']
    arcs = elements['arcs']

    places_id_to_index = {}
    transitions_id_to_index = {}

    place_index = 0
    for place in places:
         places_id_to_index[place['id']] = place_index
         place_index += 1

    transition_index = 0
    for transition in transitions:
         transitions_id_to_index[transition['id']] = transition_index
         transition_index += 1

   