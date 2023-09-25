import numpy as np
import math

from .model_analysis_utils import is_s_system, is_t_system

class Model:
    def __init__(self, model):
        self.model = model
        self.places_id_to_index = self.map_place_id_to_index()
        self.transitions_id_to_index = self.map_transition_id_to_index()

        self.incidence_matrix = self.create_incidence_matrix()

        self.transition_delays = self.determine_delays_transitions()
        self.place_marking = self.create_place_marking()

    def simulation_without_sim_step(self):
        sim_iteration_result = {
            'input_places': [], 
            'output_places': [],
            'transition_id': [],
            'delay': 0,
            'continue_sim': True
        }

        indices_enabled_transitions = self.determine_enabled_transitions()

        indices_timed_enabled_transitions = []

        for transition_index in indices_enabled_transitions:
            if not math.isinf(self.transition_delays[transition_index]):
                indices_timed_enabled_transitions.append(transition_index)

        min_delay = float('inf')
        index_transition_with_min_delay = -1
        
        if indices_timed_enabled_transitions:
            for transition_index in indices_enabled_transitions:
                if self.transition_delays[transition_index] < min_delay:
                    index_transition_with_min_delay = transition_index
        else:
            #For now ignore enabled immediate transitions
            sim_iteration_result['continue_sim'] = False
            return sim_iteration_result

        if index_transition_with_min_delay != -1:
            #Timed transition to fire has been chosem
            transition_id = self.transition_indices_to_ids([index_transition_with_min_delay])[0]
            firing_result = self.fire_transition(transition_id)

            sim_iteration_result['input_places'].extend(firing_result['input_places'])
            sim_iteration_result['output_places'].extend(firing_result['output_places'])
            sim_iteration_result['transition_id'].append(transition_id)
            sim_iteration_result['delay'] = self.transition_delays[index_transition_with_min_delay]

            #Update the delay of the 
            for transition in self.model['transitions']:
                if transition['id'] == transition_id:
                    if self.is_transition_enabled(index_transition_with_min_delay):
                        #Recalculate the delay only if still enabled
                        self.calculate_delay_transition(transition)
            
            return sim_iteration_result


    def simulation_with_sim_step(self, sim_step):
        result =  self.sim_iteration_timed_net_with_sim_step(sim_step)
        indices_fired_transitions = result['transition_indices']
        continue_sim = result['continue_sim']
        
        
        ids_fired_transitions = self.transition_indices_to_ids(indices_fired_transitions)

        sim_iteration_result = {
            'input_places': [], 
            'output_places': [],
            'transition_id': [],
            'continue_sim': True
        }

        if not continue_sim:
            sim_iteration_result['continue_sim'] = False
            return sim_iteration_result

        sim_iteration_result['delays'] = result['delays']

        for transition_id in ids_fired_transitions:
            result_firing_transition = self.fire_transition(transition_id)

            sim_iteration_result['input_places'].extend(result_firing_transition['input_places'])
            sim_iteration_result['output_places'].extend(result_firing_transition['output_places'])
            sim_iteration_result['transition_id'].append(transition_id)


        return sim_iteration_result

    def sim_iteration_timed_net_with_sim_step(self, sim_step):
        #First determine all enabled transitions
        indices_enabled_transitions = self.determine_enabled_transitions()


        if not indices_enabled_transitions:
            return {'transition_indices': [], 'continue_sim': False}

        #Based on the delay, determine if immediate or timed
        #For immediate transitions, default delay value is -inf
        indices_enabled_timed_transitions = []
        indices_enabled_immediate_transitions = []

        for transition_index in indices_enabled_transitions:
            if self.transition_delays[transition_index] < 0:
                indices_enabled_immediate_transitions.append(transition_index)
            else:
                indices_enabled_timed_transitions.append(transition_index)

        incidence_matrix_dim = self.incidence_matrix.shape
        rows = incidence_matrix_dim[0]
        cols = incidence_matrix_dim[1]
        
        #For all timed transitions, recalculate the new delay based on the sim_step
        remaining_delays_timed_transitions = self.calculate_remaining_transition_delays(indices_enabled_timed_transitions, sim_step)

        #The delays should be updated
        for transition in remaining_delays_timed_transitions:
            self.transition_delays[transition['index']] = transition['remain_delay']


        print("Remaining delays of transitions:")
        print(remaining_delays_timed_transitions)
        print("--------------------------------------------")

        indices_timed_transitions_ready_to_fire = []

        for transition in remaining_delays_timed_transitions:
            if transition['remain_delay'] < 0:
                #Only transitions for which the delay has passed can actually fire
                indices_timed_transitions_ready_to_fire.append(transition['index'])

        print("Indices transitions ready to fire")
        print(indices_timed_transitions_ready_to_fire)
        print("--------------------------------------------")

        #All transitions, which should be fired in this iteration
        firing_transitions = []

        for place_index in range(0, rows):
            indices_input_timed_transitions = []
            indices_input_immediate_transitions = []

            #Logic here is quite confusing...needs refactoring
            for transition_index in indices_timed_transitions_ready_to_fire:
                if self.incidence_matrix[place_index][transition_index] < 0:
                    indices_input_timed_transitions.append(transition_index)

            for transition_index in indices_enabled_immediate_transitions:
                if self.incidence_matrix[place_index][transition_index] < 0:
                    indices_input_immediate_transitions.append(transition_index)

            #All input transitions found
            if indices_input_timed_transitions:
                #Choose the input time transition with the lowest delay, syntax sugar...
                input_transitions_remain_delays = [transition for transition in remaining_delays_timed_transitions if transition['index'] in indices_input_timed_transitions]
                min_delay = min(transition['remain_delay'] for transition in input_transitions_remain_delays)
                
                print("Current minimum delay:")
                print(min_delay)
                print("--------------------------------------------")
                
                
                index_transition_min_delay = [transition['index'] for transition in input_transitions_remain_delays if transition['remain_delay'] == min_delay][0]


                print("Indices of timed transitions ready to fire:")
                print(indices_timed_transitions_ready_to_fire)
                print("----------------------------------------------")
                print("Index of input transition to fire:")
                print(index_transition_min_delay)


                #Remove from choice
                indices_timed_transitions_ready_to_fire.remove(index_transition_min_delay)

                #Calculate new delay for fired timed transition
                transition_id = self.transition_indices_to_ids([index_transition_min_delay])[0]

                transition_model = [transition for transition in self.model['transitions'] if transition['id'] == transition_id][0]
                print("Transition for which delay should be updated:")
                print(transition_model)
                self.transition_delays[index_transition_min_delay] = self.calculate_delay_transition(transition_model)
                
                firing_transitions.append(index_transition_min_delay)

            elif indices_input_immediate_transitions:
                #Choose on random to fire one input immediate transition
                random_input_immediate_transition = np.random.choice(indices_input_immediate_transitions)
                
                #Transition will be fired remove the list of available ones
                indices_enabled_immediate_transitions.remove(random_input_immediate_transition)
                
                #Add transition for firing in this iteration
                firing_transitions.append(random_input_immediate_transition)

        return {'transition_indices':firing_transitions, 'delays': remaining_delays_timed_transitions, 'continue_sim': True}

    def fire_transition(self, transition_id):
        """
        Fire a transition with 'transition_id'
        Return the {id, tokens} of all input and output places and the delay
        """
        transition_index = self.transitions_id_to_index[transition_id] 
        input_places = []
        output_places = []
       
        for index, matrix_entry in enumerate(self.incidence_matrix[:, transition_index]):
            if matrix_entry == -1:
                self.place_marking[index] -= 1

                place_tokens = self.place_marking[index]
                place_id = self.place_indices_to_ids([index])[0]

                input_places.append({'id': place_id, 'tokens': place_tokens})
            elif matrix_entry == 1:
                #This is an output place
                self.place_marking[index] += 1
                
                place_tokens = self.place_marking[index]
                place_id = self.place_indices_to_ids([index])[0]

                output_places.append({'id': place_id, 'tokens': place_tokens})
                
    
        delay = 0

        if not math.isinf(self.transition_delays[transition_index]):
            delay = self.transition_delays[transition_index]
        
        input_output_places = {'input_places': input_places, 'output_places': output_places, 'transition_id': [transition_id], 'delay': delay}
        return input_output_places
   
    def get_enabled_transition_ids(self):
        """
        Return the id's of all enabled transitions in the model
        """
        indices_enabled_transitions = self.determine_enabled_transitions()
        ids_enabled_transitions = self.transition_indices_to_ids(indices_enabled_transitions)

        return ids_enabled_transitions

#---------------------------------------------------------
# Helper methods
#---------------------------------------------------------
    def determine_enabled_transitions(self):
        """
        Return the indices of all enabled transition of the current model
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
#---------------------------------------------------------
#Helper methods
#---------------------------------------------------------
    def create_place_marking(self):
        place_marking = np.zeros(len(self.places_id_to_index))

        for place in self.model['places']:
            place_tokens = place['token_number']
            place_index = self.places_id_to_index[place['id']]
            place_marking[place_index] = place_tokens

        return place_marking

    def create_incidence_matrix(self):
            """Doc of the function"""
            arcs = self.model['arcs']
            incidence_matrix = np.zeros([len(self.places_id_to_index), len(self.transitions_id_to_index)])

            for arc in arcs:
                #Assuming correct linking between elements!
                #Should be implemented in the frontend!
                #TODO: Ensure only place<->transition and transition<->place possible
                input_place = None
                if arc['source'] in self.places_id_to_index:
                    place_index = self.places_id_to_index[arc['source']]
                    transition_index = self.transitions_id_to_index[arc['target']]
                    input_place = True
                else:
                    place_index = self.places_id_to_index[arc['target']]
                    transition_index = self.transitions_id_to_index[arc['source']]
                    input_place = False

                if input_place == True:
                    incidence_matrix[place_index][transition_index] = -1
                elif input_place == False:
                    incidence_matrix[place_index][transition_index] = 1
                else:
                    incidence_matrix[place_index][transition_index] = 0
            
            return incidence_matrix
    
    def map_place_id_to_index(self):
        """
        Create a place dictionary of the form: {'id': ..., 'index': ...} \n
        Index is the row index of the place in the incidence matrix
        """
        places = self.model['places']
        
        places_id_to_index = {}

        index = 0
        for place in places:
            places_id_to_index[place['id']] = index
            index += 1

        return places_id_to_index
    
    def map_transition_id_to_index(self):
        """
        Create a transition dictionary of the form: {'id': ..., 'index': ...} \n 
        Index is the column index of the transition in the incidence matrix
        """

        transitions = self.model['transitions']

        transitions_id_to_index = {}

        index = 0
        for transition in transitions:
            transitions_id_to_index[transition['id']] = index
            index+=1

        return transitions_id_to_index

    def transition_indices_to_ids(self, indices):
        """
        Determine the id's of all transitions, whose index is inside 
        the indices array
        """
        id_transitions = []

        
        for key, value in self.transitions_id_to_index.items():
            if value in indices:
                id_transitions.append(key)
                indices.remove(value)
        

        return id_transitions

    def place_indices_to_ids(self, indices):
        """
        Determine the id's of all places, whose index is inside 
        the indices array
        """
        id_places = []

        for key, value in self.places_id_to_index.items():
            if value in indices:
                id_places.append(key)
                indices.remove(value)

        return id_places
    
    def transition_ids_to_indices(self, ids):
        """
        Determine the indices of all transitions, whose id is inside the ids array
        """
        indices_transitions = []

        for key, value in self.transitions_id_to_index.items():
            if key in ids:
                indices_transitions.append(value)
                ids.remove(key)

        return indices_transitions

    def determine_transitions_without_input_place(self):
        """
        Determine all transitions without input place \n
        """
        indices_transitions_without_input_place = []

        dimensions_matrix = self.incidence_matrix.shape
        cols = dimensions_matrix[1]
        rows = dimensions_matrix[0]

        for col_index in range(0, cols):
            transition_without_input_place = True

            for row_index in range(0, rows):
                matrix_value = self.incidence_matrix[row_index][col_index]
                if matrix_value < 0:
                    transition_without_input_place = False
                    break

            if transition_without_input_place:
                indices_transitions_without_input_place.append(col_index)

        return indices_transitions_without_input_place

#---------------------------------------------------------       
    def determine_delays_transitions(self):
        """
        Calculate the delays of the transition with index inside the indices array \n
        Possible only for timed transitions \n
        Default value of delay for immediate transition is -inf
        """
        transition_delays = []

        for transition in self.model['transitions']:
            if transition['timed']:
                delay = self.calculate_delay_transition(transition)
                transition_delays.append(delay)
            else: 
                #For immediate transitions there is no delay, use def value of -inf
                transition_delays.append(float('-inf'))

        return transition_delays

    #Should be possible to do this also by transition id or index
    def calculate_delay_transition(self, transition):
        if transition['distribution_type'] == 'exponential':
            if transition['rate'] == 0:
                print("Exponential rate parameter cannot be 0!")
            else:
                beta_parameter = 1 / transition['rate']

            return np.random.default_rng().exponential(beta_parameter)

        elif transition['distribution_type'] == 'general':
            pass

    def calculate_min_transition_delay(self, indices):
        """
        Calculate the minimal delay of all transitions, whose indices are in the indices array
        """
        min_delay = float('inf')

        #Immediate transitions with the default delay of -1 are ignored
        for transition_index in indices:
            delay_transition = self.transition_delays[transition_index]
            if delay_transition > -1 and delay_transition < min_delay:
                min_delay = delay_transition

        return min_delay
        
    def find_transitions_by_delay(self, delay, indices):
        indices_transitions = []

        for transition_index in indices:
            if self.transition_delays[transition_index] == delay:
                indices_transitions.append(transition_index)

    
        return indices_transitions
    
#---------------------------------------------------------

    #This is just not working, do not use for now....
    def calculate_remaining_transition_delays(self, indices_transitions, sim_step):
        remaining_delays = []

        for transition_index in indices_transitions:
            delay = self.transition_delays[transition_index] - sim_step
            remaining_delays.append({'index': transition_index, 'remain_delay': delay})

        return remaining_delays

    #Update the delays of timed transitions, by the sim_step
    def update_transition_delays(self, indices_transitions, sim_step):
        for transition_index in indices_transitions:
            self.transition_delays[transition_index] = self.transition_delays[transition_index] - sim_step

    def find_min_delay(self, transition_with_delays):
        min_delay = min(transition['remain_delay'] for transition in transition_with_delays)

        for transition in transition_with_delays:
            if transition['remain_delay'] == min_delay:
                return transition
            
    def is_transition_enabled(self, transition_index):
        """
        Determine if the transition with transition_index is enabled
        """
        dimensions_matrix = self.incidence_matrix.shape
        rows = dimensions_matrix[0]
        
        for place_index in range(0, rows):
            if self.incidence_matrix[place_index][transition_index] < 0:
                if self.place_marking[place_index] <= 0:
                    #Not enough tokens for a transition to fire
                    return False
                

        return True
