from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from services.video_service import anonymize_video
import os

router = APIRouter(prefix="/api/video", tags=["Video"])

# Utility to save uploaded file temporarily
async def save_upload_temp(file: UploadFile, upload_dir: str = "temp_uploads") -> str:
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    return file_path


@router.post("/anonymize")
async def video_anonymizer(file: UploadFile = File(...)):
    try:
        # Save uploaded file
        input_path = await save_upload_temp(file)
        output_path = input_path.replace(
            os.path.splitext(input_path)[1], "_anon.mp4"
        )

        # Process anonymization
        anonymize_video(input_path, output_path)

        # Return anonymized video
        return FileResponse(
            output_path,
            media_type="video/mp4",
            filename="anonymized_video.mp4",
            headers={"X-Video-Codec": "avc1"}  # let frontend know
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
