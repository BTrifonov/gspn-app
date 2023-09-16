import numpy as np


#TODO: Think about edge cases such as input_place, output_place, input_transition/output_transition 0


# A model is S-system iff each transition has one input place and one output place
# A S-system ensures no synchronization, thus no parallel transition firing possible
def is_s_system(incidence_matrix):
    """
    Determine if a PN model is S-system, given the incidence_matrix parameter \n
    Model is S-system iff each transition has one input place and one output place \n
    No synchronization
    """
    for column in incidence_matrix.T:
        input_places = 0
        output_places = 0

        for entry in column:
            if entry < 0:
                input_places+=1
            elif entry > 0:
                output_places+=1

        if(output_places!= 1 or input_places != 1):
            return False
        
    return True


# A model is T system iff each place has one input transition and one output transition
# A T-system ensures no conflicts, thus no choices should be made between two enabled transitions
def is_t_system(incidence_matrix):
    """
    Determine if a PN model is T-system, given the incidence_matrix parameter \n
    Model is T system iff each place has one input transition and one output transition \n
    No conflicts
    """
    for row in incidence_matrix:
        input_transition = 0 
        output_transition = 0

        for entry in row:
            if entry < 0:
                input_transition+=1
            elif entry > 0:
                output_transition+=1

        if(input_transition!= 1 or output_transition != 1):
            return False
        
    return True


