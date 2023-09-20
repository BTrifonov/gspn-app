import numpy as np
import math

from .model_analysis_utils import is_s_system, is_t_system

#Use rather an abstract class for model
#Simple PN model and GSPNs should be different subclasses
class Model:
    def __init__(self, model):
        self.model = model
        self.places_id_to_index = self.map_place_id_to_index()
        self.transitions_id_to_index = self.map_transition_id_to_index()

        self.incidence_matrix = self.create_incidence_matrix()

        self.transition_delays = self.determine_transitions_delays()
        self.place_marking = self.create_place_marking()

    def sim_iteration(self):
        """
        One iteration of the simulation, in which all enabled transitions are fired \n
        In case of a conflict immediate transitions always have higher priority than timed \n
        The choice between two immediate transitions is random
        """
        sim_iteration_result = {
            'input_places': [], 
            'output_places': [],
            'transition_id': [],
            'enabled_transitions': False
        }

        transitions_to_fire_ids = self.determine_transitions_to_fire()

        #In a timed PN enabled transitions have certain delays, calculate them
        #Currently assume that it is not possible to fire simultaneously timed and immediate transitions
        
        for transition_id in transitions_to_fire_ids:
            firing_res = self.fire_transition(transition_id)
            
            sim_iteration_result['input_places'].extend(firing_res['input_places'])
            sim_iteration_result['output_places'].extend(firing_res['output_places'])
            sim_iteration_result['transition_id'].append(transition_id)

            sim_iteration_result['enabled_transitions'] = True

        print(sim_iteration_result)
        return sim_iteration_result
       
    def sim_iteration_timed_net(self):
        """
        One iteration of the simulation, in which all enabled transitions are fired \n
        In case of a conflict immediate transitions always have higher priority than timed \n
        The choice between two immediate transitions is random
        """
        sim_iteration_result = {
            'input_places': [], 
            'output_places': [],
            'transition_id': [],
            'enabled_transitions': False
        }

        firing_transitions = self.determine_firing_transitions_timed_petri_net()
    
        firing_transitions_ids = firing_transitions['transition_ids']
        
        
        firing_transitions_delay = firing_transitions['delay']


        for transition_id in firing_transitions_ids:
            firing_res = self.fire_transition(transition_id)
            
            sim_iteration_result['input_places'].extend(firing_res['input_places'])
            sim_iteration_result['output_places'].extend(firing_res['output_places'])
            sim_iteration_result['transition_id'].append(transition_id)

        sim_iteration_result['enabled_transitions'] = True

        #If only immediate transitions have been fired, delay is -1 by default
        sim_iteration_result['delay'] = firing_transitions_delay
            
        return sim_iteration_result


    def fire_transition(self, transition_id):
        """
        Fire a transition with 'transition_id' and
        return the {id, tokens} of all input and output places
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
                
    
        delay = self.transition_delays[transition_index]
        input_output_places = {'input_places': input_places, 'output_places': output_places, 'transition_id': [transition_id], 'delay': delay}
        print(input_output_places)
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
    def determine_transitions_to_fire(self):
        indices_transitions_to_fire = []

        incidence_matrix_dim = self.incidence_matrix.shape
        rows = incidence_matrix_dim[0]
        cols = incidence_matrix_dim[1]

        indices_enabled_transitions = self.determine_enabled_transitions()

        for place_index in range(0, rows):
            input_transitions = []

            for transition_index in indices_enabled_transitions:
                matrix_entry = self.incidence_matrix[place_index][transition_index]
                if matrix_entry < 0:
                    #At this point we know that transition is enabled, however should check whether it is immediate or timed
                    input_transitions.append(transition_index)

            #If the input transition has already be chosen by another place, look for another one
            random_chosen_transitions = []
            while random_chosen_transitions != input_transitions:
                random_input_transition = np.random.choice(input_transitions)
                random_chosen_transitions.append(random_input_transition)

                if random_input_transition not in indices_transitions_to_fire:
                    indices_transitions_to_fire.append(random_input_transition)
                    break

        indices_transitions_without_input_place = self.determine_transitions_without_input_place() 
        indices_transitions_to_fire.extend(indices_transitions_without_input_place)
        
        transitions_to_fire_ids = self.transition_indices_to_ids(indices_transitions_to_fire)
        return transitions_to_fire_ids

    def determine_firing_transitions_timed_petri_net(self):
        indices_transitions_to_fire = []

        incidence_matrix_dim = self.incidence_matrix.shape
        rows = incidence_matrix_dim[0]

        indices_enabled_transitions = self.determine_enabled_transitions()


        print("Currently enabled transitions are: ")
        print(indices_enabled_transitions)

        min_delay = float('inf')
        at_least_one_immediate_transition = False

        for place_index in range(0, rows):
            input_transitions_timed = []
            input_transitions_immediate = []

            for transition_index in indices_enabled_transitions:
                matrix_entry = self.incidence_matrix[place_index][transition_index]
                if matrix_entry < 0:
                    #At this point we know that transition is enabled, however should check whether it is immediate or timed
                    #Delay is -1 for immediate transitions
                    if self.transition_delays[transition_index] == -1:
                        input_transitions_immediate.append(transition_index)
                    else:
                        input_transitions_timed.append(transition_index)
    

            print("Input timed transitions are:")
            print(input_transitions_timed)
            print("Input immediate transitions are:")
            print(input_transitions_immediate)


            #There is at least one immediate transition, follow the previous logic
            #Timed transitions are ignored
            if len(input_transitions_immediate) > 0:
                random_chosen_transitions = []
                while random_chosen_transitions != input_transitions_immediate:
                    random_input_transition = np.random.choice(input_transitions_immediate)
                    random_chosen_transitions.append(random_input_transition)

                    if random_input_transition not in indices_transitions_to_fire:
                        indices_transitions_to_fire.append(random_input_transition)
                        break
                
                at_least_one_immediate_transition = True
                print("At least one immediate transition has been found")
            elif not at_least_one_immediate_transition:
                #No immediate transitions found \n
                #Decision based on the calculated delays of the input transitions of the place
                #Take the minimal delay and fire all timed transitions with this delay, -1 as delay is ignored
                delay = self.calculate_min_transition_delay(input_transitions_timed)
                if delay < min_delay:
                    #Remove all transition_indices with the old min_delay
                    transition_indices_to_remove = self.find_transitions_by_delay(min_delay, indices_enabled_transitions)
                    for index in transition_indices_to_remove:
                        if index in indices_transitions_to_fire:
                            indices_transitions_to_fire.remove(index)


                    #Add all transition_indices with the new delay
                    transition_indices_to_add = self.find_transitions_by_delay(delay, indices_enabled_transitions)
                    indices_transitions_to_fire.extend(transition_indices_to_add)

                    min_delay = delay

                
        #Eliminate possible duplicates        
        indices_transitions_to_fire = set(indices_transitions_to_fire)
        ids_transitions_to_fire = self.transition_indices_to_ids(indices_transitions_to_fire)

        if math.isinf(min_delay):
            print({'transition_ids': ids_transitions_to_fire, 'delay': -1})
            return {'transition_ids': ids_transitions_to_fire, 'delay': -1}
        else:
            print({'transition_ids': ids_transitions_to_fire, 'delay': min_delay})
            return {'transition_ids': ids_transitions_to_fire, 'delay':min_delay} 
    
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
    def determine_transitions_delays(self):
        """
        Calculate the delays of the transition with index inside the indices array \n
        Possible only for timed transitions \n
        Default value of delay for immediate transition is -1
        """
        transition_delays = []

        for transition in self.model['transitions']:
            if transition['timed']:
                delay = self.calculate_delay_transition(transition)
                transition_delays.append(delay)
            else: 
                #For immediate transitions there is no delay, use def value of -1
                transition_delays.append(-1)

        return transition_delays

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
