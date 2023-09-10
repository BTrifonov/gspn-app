import numpy as np

#Create the incidence matrix of a petri net
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
    
    arr = np.zeros([len(places), len(transitions)])

    for arc in arcs:
        #Assuming correct linking between elements!
        #Should be implemented in the frontend!
        #TODO: Ensure only place<->transition and transition<->place possible
        
        input_place = None
        if arc['source'] in places_id_to_index:
            place_index = places_id_to_index[arc['source']]
            transition_index = transitions_id_to_index[arc['target']]
            input_place = True
        else:
            place_index = places_id_to_index[arc['target']]
            transition_index = transitions_id_to_index[arc['source']]
            input_place = False

        if input_place == True:
            arr[place_index][transition_index] = -1
        elif input_place == False:
            arr[place_index][transition_index] = 1
        else:
            arr[place_index][transition_index] = 0
    
    return arr


def get_place_marking(elements):
    """Doc of the function"""
    places = elements['places']
    
    places_id_to_index = {}

    place_index = 0
    for place in places:
         places_id_to_index[place['id']] = place_index
         place_index += 1
    
    
    marking = np.zeros(len(places))

    for place in places:
        place_tokens = place['token_number']
        place_index = places_id_to_index[place['id']]
        marking[place_index] = place_tokens

    return marking

def determine_enabled_transitions(incidence_matrix, marking):
    indices_enabled_transitions = []

    dimensions_matrix = incidence_matrix.shape
    cols = dimensions_matrix[1]
    rows = dimensions_matrix[0]

    print(cols)
    print(rows)

    #print("Dimensions of the marking are: " + dimensions_marking)
    #Iterate over the columns (transitions) in the outer loop
    #Iterate over the rows (places) in the inner loop
    #Complexity is O(rows x cols)
    for i in range(0, cols):
        transition_enabled = True

        for j in range(0, rows):
            matrix_value = incidence_matrix[j][i]

            #If the matrix_value is 0, then there is no connection between
            #the transition and the place
            if(matrix_value != 0):
                if(incidence_matrix[j][i] > marking[j]):
                    transition_enabled = False
                    break
        
        if transition_enabled:
            indices_enabled_transitions.append(i)


    return indices_enabled_transitions

