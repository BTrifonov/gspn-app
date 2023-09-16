import numpy as np

from .model_analysis_utils import is_s_system, is_t_system


class Model:

    def __init__(self, model):
        self.model = model
        self.places_id_to_index = self.map_place_id_to_index()
        self.transitions_id_to_index = self.map_transition_id_to_index()

        self.incidence_matrix = self.create_incidence_matrix()
        #print(self.incidence_matrix)

        self.place_marking = self.create_place_marking()
        #print(self.place_marking)


    def sim_iteration(self):
        """
        One iteration of the simulation, in which all enabled transitions are fired
        """
        sim_iteration_result = {
            'input_places': [], 
            'output_places': [],
            'transition_id': [],
            'enabled_transitions': False
        }

        transitions_to_fire_ids = self.create_magic()

        for transition_id in transitions_to_fire_ids:
            firing_res = self.fire_transition(transition_id)
            
            sim_iteration_result['input_places'].extend(firing_res['input_places'])
            sim_iteration_result['output_places'].extend(firing_res['output_places'])
            sim_iteration_result['transition_id'].append(transition_id)

            #Should be done with helper var so that it is not repeated multiple times
            sim_iteration_result['enabled_transitions'] = True

        return sim_iteration_result

        
    def create_magic(self):
        transitions_to_fire = []

        incidence_matrix_dim = self.incidence_matrix.shape
        rows = incidence_matrix_dim[0]
        cols = incidence_matrix_dim[1]

        for row_index in range(0, rows):
            input_transitions = []

            for col_index in range(0, cols):
                matrix_entry = self.incidence_matrix[row_index][col_index]
                if matrix_entry < 0:
                    if abs(matrix_entry) <= self.place_marking[row_index]:
                        input_transitions.append(col_index)

            random_chosen_transitions = []
            while random_chosen_transitions != input_transitions:
                random_input_transition = np.random.choice(input_transitions)
                random_chosen_transitions.append(random_input_transition)

                if random_input_transition not in transitions_to_fire:
                    transitions_to_fire.append(random_input_transition)
                    break

        #With this function transitions without input_places won't fire, should be solved
        transitions_to_fire_ids = self.transition_indices_to_ids(transitions_to_fire)
        return transitions_to_fire_ids
       

    def enabled_transitions(self):
        transition_enabled_arr = []

        dimensions_matrix = self.incidence_matrix.shape
        cols = dimensions_matrix[1]
        rows = dimensions_matrix[0]

        for col_index in range(0, cols):
            transition_enabled = True
            input_place_counter = 0

            for row_index in range(0, rows):
                matrix_entry = self.incidence_matrix[row_index][col_index] 
                if matrix_entry < 0:
                    #Found input place
                    if abs(matrix_entry) > self.place_marking[row_index]:
                        #Insufficient token number in the input place
                        transition_enabled = False
                        break

                    #Sufficient token number in the input place
                    input_place_counter+=1
            
            if transition_enabled:
                transition_enabled_arr.append({'enabled': True, 'input_places': input_place_counter})
            else:
                transition_enabled_arr.append({'enabled': True, 'input_places': input_place_counter})
            

    async def sim_fire_transition(self):
        """
        Simulate a random transition firing
        """
        ids_enabled_transitions = self.determine_enabled_transitions()
        
        print("Ids of enabled transitions are: ")
        print(ids_enabled_transitions)

        #Construct the response
        response = {
            'input_places': [], 
            'output_places': [],
            'transition_id': [] 
        }

        #No enabled transitions
        if len(ids_enabled_transitions) == 0:
            response['enabled_transitions'] = False
            return response
        
        #Choose random transition index, if more than one enabled transitions    
        transitions_to_fire = self.choose_transitions(ids_enabled_transitions)

        print("Indexes of transitions,which will be fired: ")
        print(transitions_to_fire)

        for transition in transitions_to_fire:
            arr = [transition]
            transition_id = self.transition_indices_to_ids(arr)[0]
            results = self.fire_transition(transition_id)

            response['input_places'].extend(results['input_places'])
            response['output_places'].extend(results['output_places'])
            
            response['transition_id'].append(transition_id)


        print("IDs of transitions, which will be fired: ")
        print(response['transition_id'])
        print("Incidence matrix:")
        print(self.incidence_matrix)
        print("--------------------------------------")
        response['enabled_transitions'] = True
        print(response)
        return response

    def choose_transitions(self, ids_enabled_transitions):
        indices_enabled_transitions = []

        result = set()
        for i in range(0, len(ids_enabled_transitions)):
            indices_enabled_transitions.append(self.transitions_id_to_index[ids_enabled_transitions[i]])

        print("Indexes of enabled transitions:")
        print(indices_enabled_transitions)
        #Iterate over each place
        for row_index, row in enumerate(self.incidence_matrix):
            input_transition = []

            for col_index in indices_enabled_transitions:
                print(row[col_index])
                print(self.place_marking[row_index])

                if(row[col_index] < 0):
                    input_transition.append(col_index)

                

            if(len(input_transition) > 0):
                random_input_transition = np.random.choice(input_transition)
                print(random_input_transition)
                result.add(random_input_transition)

        return result

    
    def determine_enabled_transitions(self):
        """
        Return the id's of all enabled transition of the current model
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


        #Get the id's of all enabled transitions
        #print(indices_enabled_transitions)
        id_enabled_transitions = self.transition_indices_to_ids(indices_enabled_transitions)

        return id_enabled_transitions

    def fire_transition(self, transition_id):
        """
        Fire a transition with 'transition_id' and
        return the {id, tokens} of all input and output places
        """
        transition_index = self.transitions_id_to_index[transition_id] 
        input_places = []
        output_places = []
       
        for index, matrix_entry in enumerate(self.incidence_matrix[:, transition_index]):
            #print(index)
            #print(matrix_entry)
            #print("-----------------------")
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
                
    
        input_output_places = {'input_places': input_places, 'output_places': output_places}
        return input_output_places


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

        for key, value in self.transition_ids_to_indices:
            if key in ids:
                indices_transitions.append(value)
                ids.remove(value)

        return indices_transitions
#---------------------------------------------------------       

