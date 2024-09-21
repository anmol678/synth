from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.routes import router as api_router


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("WEBAPP_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Hello World"}