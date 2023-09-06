from pathlib import Path

import json

#Write the PN model to a local file with file_name
def write_model_file(model_data, file_name):
    """Doc of the function"""
    try:
        current_dir_path = Path.cwd()
        model_dir_path = current_dir_path / "models" 

        if not model_dir_path.is_dir():
            create_model_dir()
        
        
        #Now dir models should be created
        model_file_path = model_dir_path / file_name
        json_cells = []

        #Transform each cell into json format
        for cell in model_data.cells:
            json_cell = json.dumps(cell.dict(), indent=4)
            json_cells.append(json_cell)

        #Write the array of json cells to a file
        with open(model_file_path, "w") as file:
           file.write("[\n")
           file.write(',\n'.join(json_cells))
           file.write("\n]")

    except OSError as e:
        print(f"The following error occurred: {e}")

def write_file_direct(model_data, file_name):
    """Doc of the function"""
    try: 
        current_dir_path = Path.cwd()
        model_dir_path = current_dir_path / "models"

        if not model_dir_path.is_dir():
            create_model_dir()

        model_file_path = model_dir_path / file_name

        with open(model_file_path, "w") as file:
            file.write(model_data)

    except OSError as e:
        print(f"The following error occured: {e}")


def get_model_file(file_name):
    """Doc of the function"""
    try:
        current_dir_path = Path.cwd()
        model_dir_path = current_dir_path /  "models"

        if not model_dir_path.is_dir():
            raise OSError("The model directory does not exist")
        
        model_file_path = model_dir_path / file_name

        if not model_file_path.is_file():
            raise OSError(f"The file with name {file_name} does not exist")

        with open(model_file_path, "r") as file:
            return file.read()
        
    except OSError as e:
        print(f"The following error occured: {e}")


#Delete the file with file_name and the directory if empty
def delete_model_file(file_name):
    try:
        current_dir_path = Path.cwd()
        
        model_dir_path = current_dir_path / "models"
        model_file_path = model_dir_path / file_name

        Path(model_file_path).unlink()

        contents = list(model_dir_path.iterdir())
        
        #Check if models directory is empty and delete it        
        if not contents:
            delete_model_dir()

    except OSError as e:
        print(f"The following error occured: {e}")







#Create the model directory
def create_model_dir():
    """Doc of the function"""
    try:
        current_dir_path = Path.cwd()
        model_dir_path = "models"
        new_dir = current_dir_path / model_dir_path

        Path(new_dir).mkdir(parents=True, exist_ok=True)

    except OSError as e:
        print(f"The following error occurred: {e}")

#Delete the model directory 
def delete_model_dir():
    """Doc of the function"""
    current_dir_path = Path.cwd()
    model_dir_path = current_dir_path / "models"

    try:
        Path(model_dir_path).rmdir()

    except OSError as e:
        print("fThe following error occured: {e}")
