from fastapi import FastAPI
from app.database import engine, Base
from app.routes import interaction
from app import models
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(interaction.router)

@app.get("/")
def home():
    return {"message": "Backend is working successfully"}