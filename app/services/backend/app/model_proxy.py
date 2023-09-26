import numpy as np
import math
import json

from .model_alternativ import Model

class ModelProxy:
    def __init__(self, data):
        self.model_proxy = self.parse_model(data)

        self.places_id_to_index = self.map_place_id_to_index()
        self.transitions_id_to_index = self.map_transition_id_to_index()

        incidence_matrix = self.create_incidence_matrix()
        place_marking = self.create_place_marking()
        transition_rate_distribution_information = self.create_transition_rate_information()
        
        self.model = Model(incidence_matrix, place_marking, transition_rate_distribution_information)

    def find_enabled_transitions(self):
        """
        Find all enabled transitions in the model

        Returns
        ----------
        The ids of all enabled transitions
        """

        # Delegate to the model object
        indices_enabled_transitions = self.model.find_enabled_transitions()

        ids_enabled_transitions = self.find_transition_ids_from_indices(indices_enabled_transitions)

        return ids_enabled_transitions

    def fire_transition(self, transition_id):
        """
        Fire a transition with id 'transition_id' \n
        Return the new token count of all input and output places \n
        Return the transition delay as well
        
        Parameters
        ----------
        transition_id: string
            The id of the transition to be fired

        Returns
        ----------
        {\n
            'input_places': [{'id': , 'tokens': },...], \n
            'output_places': [{'id': , 'tokens': },...], \n
            'transition_id': transition_id, \n
            'delay': delay \n
        }
        """
        transition_index = self.transitions_id_to_index[transition_id]

        transition_firing = self.model.fire_transition(transition_index)
        
        result = {
            'input_places': [], 
            'output_places': [],
            'transition_id': [transition_id], 
            'delay': transition_firing['delay']
        }

        for input_place in transition_firing['input_places']:
            input_place_id = self.find_place_ids_from_indices([input_place['index']])[0]
            result['input_places'].append({'id': input_place_id, 'tokens': input_place['tokens']})

        for output_place in transition_firing['output_places']:
            output_place_id = self.find_place_ids_from_indices([output_place['index']])[0]
            result['output_places'].append({'id': output_place_id, 'tokens': output_place['tokens']})

        return result

    def sim_iteration(self):
        """
        Perform one simulation iteration \n
        Delegate the execution to the model object

        Returns
        --------------------
        {\n
            'input_places':[], \n
            'output_places': [], \n
            'transition_id': [], \n
            'delay': Float, \n
            'continue_sim': True | False \n
        }
        """
        
        result = {
            'input_places': [], 
            'output_places': [],
            'transition_id': [],
            'delay': 0,
            'continue_sim': True
        }

        transition_firing = self.model.simulate()

        if transition_firing == None:
            result['continue_sim'] = False
    
        else:
            result['transition_id'].append(self.find_transition_ids_from_indices([transition_firing['transition_index']])[0])
            result['delay'] = transition_firing['delay']

            for input_place in transition_firing['input_places']:
                input_place_id = self.find_place_ids_from_indices([input_place['index']])[0]
                result['input_places'].append({'id': input_place_id, 'tokens': input_place['tokens']})

            for output_place in transition_firing['output_places']:
                output_place_id = self.find_place_ids_from_indices([output_place['index']])[0]
                result['output_places'].append({'id': output_place_id, 'tokens': output_place['tokens']})

        return result



#---------------------------------------------------------
# Functions responsible for extracting model information
# from the plain json object, passed in the constructor
#---------------------------------------------------------
    def parse_model(self, model_data):
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
                place_dict = self.parse_place(cell = cell)
                places.append(place_dict)
                
            elif(element_type == 'custom.Transition'):
                transition_dict = self.parse_transition(cell = cell)
                transitions.append(transition_dict)
                
            elif(element_type == 'standard.Link'):
                arc_dict = self.parse_arc(cell = cell)
                arcs.append(arc_dict)

        model['places'] = places
        model['transitions'] = transitions
        model['arcs'] = arcs

        #For test purposes save data locally
        #write_file(data=json.dumps(model, indent=4), file_name="model-parsed.json")

        return model

    def parse_place(self, cell):
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

    def parse_transition(self, cell):
        """
        Retrieve relevant transition attributes for a simulation
        For now: id, distribution, rate
        """
        transition = {}

        #Extract the id
        transition['id'] = cell['id']

        #Determine the transition type -> immediate or timed
        transition['timed'] = cell['timed']

        if transition['timed']:
            #Extract token distribution and rate if timed transition
            transition['distribution_type'] = cell['tokenDistribution']
            transition['rate'] = cell['rate']

        return transition

    def parse_arc(self,cell):
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

#---------------------------------------------------------
# Functions responsible for creating the incidence matrix,
# place marking and transition info array, passed to the
# model object in the constructor
#---------------------------------------------------------
    def create_place_marking(self):
        place_marking = np.zeros(len(self.places_id_to_index))

        for place in self.model_proxy['places']:
            place_tokens = place['token_number']
            place_index = self.places_id_to_index[place['id']]
            place_marking[place_index] = place_tokens

        return place_marking

    def create_incidence_matrix(self):
        """Doc of the function"""
        arcs = self.model_proxy['arcs']
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

    def create_transition_rate_information(self):
        """
        Create an a dictionary array of the form: [{'timed': ..., distribution_type':..., 'rate':....}] \n
        for each transition in self.model_proxy. \n
        Information passed to the model object, indexing follows the transition indexing in the incidence matrix
        """
        number_of_transitions = len(self.transitions_id_to_index)

        transition_rates = [None] * number_of_transitions

        for transition in self.model_proxy['transitions']:
            current_transition_information = {}
            
            current_transition_information['timed'] = transition['timed']
            current_transition_information['distribution_type'] = transition['distribution_type']
            current_transition_information['rate'] = transition['rate']

            transition_index = self.transitions_id_to_index[transition['id']]

            transition_rates[transition_index] = current_transition_information

        return transition_rates

#---------------------------------------------------------
# Functions responsible for the mapping between
# the id of elements and their indices in the model object
#---------------------------------------------------------
    def map_place_id_to_index(self):
        """
        Create a place dictionary of the form: {'id': ..., 'index': ...} \n
        Index is the row index of the place in the incidence matrix
        """
        places = self.model_proxy['places']
        
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

        transitions = self.model_proxy['transitions']

        transitions_id_to_index = {}

        index = 0
        for transition in transitions:
            transitions_id_to_index[transition['id']] = index
            index+=1

        return transitions_id_to_index

    def find_transition_ids_from_indices(self, indices):
        """
        Return all transition ids, whose index is in the provided indices array
        """
        transition_ids = []

        for transition_id, transition_index in self.transitions_id_to_index.items():
            if transition_index in indices:
                transition_ids.append(transition_id)
                indices.remove(transition_index)

        return transition_ids

    def find_place_ids_from_indices(self, indices):
        """
        Return all place ids, whose index is in the provided indices array
        """
        place_ids = []

        for place_id, place_index in self.places_id_to_index.items():
            if place_index in indices:
                place_ids.append(place_id)
                indices.remove(place_index)

        return place_ids

    


    