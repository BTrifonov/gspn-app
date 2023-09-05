from pathlib import Path
import json

#Create the model dir if first save of the model
def create_model_dir():
    """Doc of the function"""
    try:
        current_dir_path = Path.cwd()
        model_dir_path = "models"
        new_dir = current_dir_path / model_dir_path

        Path(new_dir).mkdir(parents=True, exist_ok=True)
    except OSError as e:
        print(f"The following error occurred: {e}")

def write_model_file(model_data):
    """Doc of the function"""
    try:
        current_dir_path = Path.cwd()
        model_dir_path = current_dir_path / "models" 

        if not model_dir_path.is_dir():
            create_model_dir()
        
        
        #Now dir models should be created
        model_file_path = model_dir_path / "model.json"

        with open(model_file_path, "w") as file:
            file.write(json.dumps(model_data, indent=4))

    except OSError as e:
        print(f"The following error occurred: {e}")


