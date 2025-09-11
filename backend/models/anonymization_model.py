from pydantic import BaseModel

class TextRequest(BaseModel):
    text: str

class TextResponse(BaseModel):
    original: str
    anonymized: str

class MediaResponse(BaseModel):
    original_url: str
    anonymized_url: str
