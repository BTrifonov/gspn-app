import numpy as np


class Model:
    def __init__(self, incidence_matrix, place_marking, transitions):
        self.incidence_matrix = incidence_matrix
        self.place_marking = place_marking
        self.transitions = transitions

        #These attributes used only for the automatic timed simulation
        self.enabled_transitions = []
        self.global_time = 0

    def find_enabled_transitions(self):
        """
        Find the indices of all enabled transitions in the model

        Returns
        ----------
        The indices of all enabled transition in the model
        """

        indices_enabled_transitions = []

        dimensions_matrix = self.incidence_matrix.shape
        cols = dimensions_matrix[1]
        rows = dimensions_matrix[0]

        #Iterate over the columns (transitions) in the outer loop
        #Iterate over the rows (places) in the inner loop
        #Complexity is O(rows x cols)
        for i in range(0, cols):
            transition_enabled = True
           
            for j in range(0, rows):
                matrix_value = self.incidence_matrix[j][i]

                #If matrix_value smaller than 0, then the place is input place for the transition
                if matrix_value < 0:
                    if abs(matrix_value) > self.place_marking[j]:
                        transition_enabled = False
                        break

            if transition_enabled:
                indices_enabled_transitions.append(i)

        return indices_enabled_transitions
    
    def fire_transition(self, transition_index, calculated_delay = None):
        """
        Fire a transition, update the place marking and calculate the transition delay \n
        
        Parameters
        ----------
        transition_index: int
            Index of the transition to be fired

        
        Returns
        ----------
        {\n
            'input_places': [{'index': , 'tokens': }, ...], \n
            'output_places:[{'index': , 'tokens': }, ...],\n
            'delay': \n
        } \n
        """
        if not self.is_transition_enabled(transition_index):
            print("Transition cannot fire, because it is not enabled!")
            return None
        
        dimensions_matrix = self.incidence_matrix.shape
        rows = dimensions_matrix[0]

        input_places = []
        output_places = []

        for place_index in range(0, rows):
            matrix_entry = self.incidence_matrix[place_index][transition_index]

            if matrix_entry < 0:
                #Remove tokens from this place
                self.place_marking[place_index] -= 1
                
                place_tokens = self.place_marking[place_index]
                input_places.append({'index': place_index, 'tokens': place_tokens})

            elif matrix_entry > 0:
                #Add tokens to this place
                self.place_marking[place_index] += 1

                place_tokens = self.place_marking[place_index]
                output_places.append({'index': place_index, 'tokens': place_tokens})

        if calculated_delay == None:
            calculated_delay = self.calculate_transition_delay(transition_index)

        self.global_time += calculated_delay
        new_marking = {'input_places': input_places, 'output_places': output_places, 'delay': self.global_time}
        return new_marking

    def simulate(self):
        """
        Perform one simulation iteration

        Returns
        ---------
        ...
        """

        #First find all enabled transitions
        indices_enabled_transitions = self.find_enabled_transitions()
        
        #If there are no enabled transitions and the queue is empty
        if not indices_enabled_transitions and not self.enabled_transitions:
            print("No more enabled transitions, sorry")
            return None

        for transition_index in indices_enabled_transitions:
            if not self.is_transition_in_enabled_transitions(transition_index):
                #Calculate the delay only for transitions, which have not been enabled before

                if self.is_transition_timed(transition_index):
                    #Ignore silently immediate transitions
                    transition_delay = self.calculate_transition_delay(transition_index)
                    self.enabled_transitions.append({'index': transition_index, 'firing_time': transition_delay})
        
        self.enabled_transitions = sorted(self.enabled_transitions, key=lambda x: x['firing_time'])
        
        print(self.enabled_transitions)
        print("------------------------------")

        firing_transition = self.enabled_transitions[0]
        
        new_marking = self.fire_transition(firing_transition['index'], firing_transition['firing_time'])

        if new_marking == None:
            print("No more enabled transitions sorry")
            return None

        #Remove the fired transition from the list of enabled transitions
        self.enabled_transitions.pop(0)

        if self.is_transition_enabled(firing_transition['index']):
            #Fired transition is still enabled, recalculate new firing time
            new_delay = self.calculate_transition_delay(firing_transition['index'])
            new_firing_time = new_delay + firing_transition['firing_time']
            self.enabled_transitions.append({'index': firing_transition['index'], 'firing_time': new_firing_time})

        new_marking['transition_index'] = firing_transition['index']
        return new_marking

#---------------------------------------------------------
# Helper methods
#---------------------------------------------------------
    def is_transition_enabled(self, transition_index):
        """
        Return if transition with index 'transition_index' is enabled \n
        based on the incidence matrix and the place marking
        """

        dimensions_matrix = self.incidence_matrix.shape
        rows = dimensions_matrix[0]
        
        for place_index in range(0, rows):
            if self.incidence_matrix[place_index][transition_index] < 0:
                if self.place_marking[place_index] <= 0:
                    #Not enough tokens for a transition to fire
                    return False
                
        return True

    def calculate_transition_delay(self, transition_index):
        """
        Calculate the transition delay for transition with index 'transition_index' \n
        Calculation done by using the 'distribution_type' and 'rate' transition information \n
        """
        transition_information = self.transitions[transition_index]

        if not transition_information['timed']:
            #If transition immediate delay is 0 by default
            return 0
        else:
            if transition_information['distribution_type'] == 'exponential':
                if transition_information['rate'] == 0:
                    print("Exponential rate parameter cannot be 0!")
                else:
                    beta_parameter = 1 / transition_information['rate']

                return np.random.default_rng().exponential(beta_parameter)
            else:
                #Should be extended for types of distributions
                pass
    
    def is_transition_timed(self, transition_index):
        transition = self.transitions[transition_index]

        return transition['timed']
    
    def is_transition_in_enabled_transitions(self, transition_index):
        for transition in self.enabled_transitions:
            if transition['index'] == transition_index:
                return True
        
        return False