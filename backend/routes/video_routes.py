from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from services.video_service import anonymize_video
import os
import traceback

router = APIRouter(
    prefix="/api/video",
    tags=["Video"]
)

MAX_SIZE_MB = 20


async def save_upload_temp(
    file: UploadFile,
    upload_dir: str = "temp_uploads"
):
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(
        upload_dir,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return file_path


@router.post("/anonymize")
async def video_anonymizer(
    file: UploadFile = File(...)
):
    input_path = None
    output_path = None

    try:
        print("Upload received:", file.filename)

        input_path = await save_upload_temp(file)

        size_mb = (
            os.path.getsize(input_path)
            / (1024 * 1024)
        )

        if size_mb > MAX_SIZE_MB:
            raise HTTPException(
                status_code=400,
                detail=f"Video exceeds {MAX_SIZE_MB}MB limit"
            )

        output_path = input_path.replace(
            os.path.splitext(input_path)[1],
            "_anon.mp4"
        )

        print("Processing started")

        anonymize_video(
            input_path,
            output_path
        )

        print("Processing complete")

        return FileResponse(
            output_path,
            media_type="video/mp4",
            filename="anonymized_video.mp4",
            headers={
                "X-Video-Codec": "avc1"
            }
        )

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        if input_path and os.path.exists(input_path):
            try:
                os.remove(input_path)
            except:
                pass
