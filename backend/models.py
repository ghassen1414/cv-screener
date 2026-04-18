from pydantic import BaseModel


class ScreeningRequest(BaseModel):
    job_description: str


class ScreeningResponse(BaseModel):
    score: int
    summary: str
    highlights: list[str]
    gaps: list[str]
