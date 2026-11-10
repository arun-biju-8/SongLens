import os
import shutil
import tempfile

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.ai_analyzer import generate_music_analysis     
from backend.audio_analyzer import analyze_audio

app = FastAPI(
    title="SongLens API",
    description="AI-powered Music Genre Classification and Analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to SongLens API",
        "status": "Running"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/api/analyze")
async def analyze_song(file: UploadFile = File(...)):
    allowed_extensions = [".mp3", ".wav"]
    extension = os.path.splitext(file.filename or "")[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only MP3 and WAV files are supported."
        )

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        ) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name

        # Step 1: ML-based audio analysis
        result = analyze_audio(temp_path)

        # Step 2: Generate AI insights using ML results
        ai_analysis = generate_music_analysis(result)

        # Step 3: Return combined response
        return {
            "filename": file.filename,
            "analysis": result,
            "ai_analysis": ai_analysis
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Audio analysis failed: {str(e)}"
        )

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

        await file.close()