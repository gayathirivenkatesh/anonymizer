# ---------------------- SUPPRESS TF WARNINGS ----------------------
import os
import logging
import warnings

# Suppress TensorFlow INFO and WARNING logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
logging.getLogger('tensorflow').setLevel(logging.ERROR)
warnings.filterwarnings('ignore', category=DeprecationWarning)
# -------------------------------------------------------------------

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes import text_routes, image_routes, metadata_routes, video_routes

app = FastAPI(title="Smart Anonymizer API")

# CORS middleware: allow your Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://anonymizer-seven.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(text_routes.router)
app.include_router(image_routes.router)
app.include_router(metadata_routes.router)
app.include_router(video_routes.router)

# Ensure uploads folder exists
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Root and healthcheck endpoints
@app.get("/")
def root():
    return {"msg": "Smart Anonymizer API Running"}

@app.get("/health")
def health():
    return {"status": "alive ✅"}

# Run locally / Render
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
