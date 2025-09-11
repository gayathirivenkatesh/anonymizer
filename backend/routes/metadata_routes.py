# routes/metadata_router.py

from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import base64
from services.metadata_service import anonymize_metadata

router = APIRouter(prefix="/api/metadata", tags=["metadata"])

@router.post("/process")
async def process(file: UploadFile = File(...)):
    file_bytes = await file.read()
    anonymized_io, removed = anonymize_metadata(file_bytes)

    # Convert image to base64 string
    encoded_image = base64.b64encode(anonymized_io.getvalue()).decode("utf-8")

    return JSONResponse({
        "removed_metadata": removed,
        "file": encoded_image,
        "message": "Metadata anonymized successfully"
    })
