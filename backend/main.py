from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from gemini import analyze_with_gemini
from models import ScreenResult
from pdf_parser import extract_text_from_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/screen", response_model=ScreenResult)
async def screen_cv(
    cv_file: UploadFile = File(...),
    job_description: str = Form(...),
):
    try:
        cv_text = extract_text_from_pdf(await cv_file.read())
        result = analyze_with_gemini(cv_text, job_description)
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))