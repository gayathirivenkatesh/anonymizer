from fastapi import APIRouter
from pydantic import BaseModel
from services.text_service import anonymize_text

router = APIRouter(prefix="/api/text", tags=["Text"])

class TextPayload(BaseModel):
    text: str

@router.post("/anonymize")
def anonymize(payload: TextPayload):
    result = anonymize_text(payload.text)
    return {"original": payload.text, "anonymized": result}
