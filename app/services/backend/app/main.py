from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware 


app = FastAPI()

origins = [
    "http://localhost:5173"
]


# NEW
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
async def main():
    return {
        "message": "Hello World"
    }

@app.get("/usr")
async def func():
    return {
        "message": "Vamos"
    }