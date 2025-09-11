# ---------------------- SUPPRESS TF WARNINGS ----------------------
import os
import logging
import warnings

# Suppress TensorFlow INFO and WARNING logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # 0=all, 1=INFO, 2=WARNING, 3=ERROR
logging.getLogger('tensorflow').setLevel(logging.ERROR)

# Suppress DeprecationWarnings from tf_keras
warnings.filterwarnings('ignore', category=DeprecationWarning)
# -------------------------------------------------------------------

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes import text_routes, image_routes, metadata_routes, video_routes

app = FastAPI(title="Smart Anonymizer API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(text_routes.router)
app.include_router(image_routes.router)
app.include_router(metadata_routes.router)
app.include_router(video_routes.router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def root():
    return {"msg": "Smart Anonymizer API Running"}
