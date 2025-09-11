from fastapi import APIRouter, UploadFile, Form
from fastapi.responses import StreamingResponse
from services.image_service import anonymize_image

router = APIRouter()

@router.post("/api/image/anonymize")
async def anonymize(file: UploadFile, regions: str = Form(...), mode: str = Form("blur")):
    buf = anonymize_image(file.file, regions, mode)
    return StreamingResponse(buf, media_type="image/png")
