from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.db import init_db


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("WEBAPP_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Hello World"}