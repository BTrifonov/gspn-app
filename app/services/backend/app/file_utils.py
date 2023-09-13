from pathlib import Path
import os

def write_file(data, file_name):
    """
    Write a file with 'file_name' as name and 'data' as content
    Stored in the '/models' dir, created if missing
    """
    
    try: 
        current_dir_path = Path.cwd()
        model_dir_path = current_dir_path / "models"

        if not model_dir_path.is_dir():
            create_model_dir()

        model_file_path = model_dir_path / file_name

        with open(model_file_path, "w") as file:
            file.write(data)

    except OSError as e:
        print(f"The following error occured: {e}")

def get_file(file_name):
    """
    Retrieve the file with 'file_name' as name
    Search in the '/models' dir
    """
    try:
        current_dir_path = Path.cwd()
        model_dir_path = current_dir_path /  "models"

        print(model_dir_path)
        if (Path.exists(model_dir_path) == False):
            raise NotADirectoryError("The model directory does not exist")
        
        model_file_path = model_dir_path / file_name

        print(model_file_path)
        if (Path.exists(model_file_path) == False):
            raise FileNotFoundError(f"The file with name {file_name} does not exist")

        with open(model_file_path, "r") as file:
            return file.read()
        
    except OSError as e:
        print(f"The following error occured: {e}")

def delete_file(file_name):
    """
    Delete the file with 'file_name' as name
    Delete the '/model' dir if empty
    """
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

def delete_all_files():
    """
    Delete all files inside the '/model/ dir
    The '/model' dir will also be deleted at the end
    """
    try:
        current_dir_path = Path.cwd()
        model_dir_path = current_dir_path / "models"

        for file in model_dir_path.glob('path'):
            Path(file).unlink()

        delete_model_dir()

    except OSError as err:
        print(err)



def file_exists(file_name):
    """
    Check if the file with 'file_name' as name exists
    """
    try:
        current_dir_path = Path.cwd()

        model_dir_path = current_dir_path / "models"
        model_file_path = Path(model_dir_path / file_name)

        if(model_file_path.exists()):
            return True
        
        return False
    except OSError as e:
        print(f"The following error occured: {e}")

#------------------------------------------------------------------
# Directory functions, used only as helpers for the upper functions
#------------------------------------------------------------------

def create_model_dir():
    """
    Create the '/model' dir
    """
    try:
        current_dir_path = Path.cwd()
        model_dir_path = "models"
        new_dir = current_dir_path / model_dir_path

        Path(new_dir).mkdir(parents=True, exist_ok=True)

    except OSError as e:
        print(f"The following error occurred: {e}")

 
def delete_model_dir():
    """
    Delete the '/model' dir
    """
    current_dir_path = Path.cwd()
    model_dir_path = current_dir_path / "models"

    try:
        Path(model_dir_path).rmdir()
        
    except OSError as e:
        print(e)
        print("fThe following error occured, while trying to delete the model dir: {e}")
