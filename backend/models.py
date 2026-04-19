# models.py
from pydantic import BaseModel
from typing import List

class ScreenRequest(BaseModel):
    job_description: str

class ScreenResult(BaseModel):
    match_score: int          # 0–100
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]
    summary: str

