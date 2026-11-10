import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

client = genai.Client(api_key=API_KEY)


def generate_music_analysis(analysis):

    genre = analysis["predicted_genre"]
    probabilities = analysis["genre_probabilities"]
    features = analysis["features"]

    tempo = features["tempo"]
    rms = features["rms_mean"]
    centroid = features["spectral_centroid_mean"]
    rolloff = features["rolloff_mean"]

    prompt = f"""
You are SongLens, an AI music analysis assistant.

Analyze the following audio analysis results.

MACHINE LEARNING RESULTS:
Predicted Genre: {genre}
Genre Probabilities: {probabilities}

AUDIO FEATURES:
Tempo: {tempo:.2f} BPM
RMS Energy: {rms:.4f}
Spectral Centroid: {centroid:.2f} Hz
Spectral Rolloff: {rolloff:.2f} Hz

Generate a clear and understandable music analysis with these sections:

1. Genre Analysis
Explain why the predicted genre may fit the song.
Mention that the prediction is based on an ML model.

2. Tempo and Rhythm
Explain the measured tempo and its possible rhythmic character.

3. Energy and Sound
Interpret the RMS energy and spectral characteristics.

4. Musical Mood
Describe the possible mood suggested by these measurements.
Avoid claiming certainty about emotions from numerical features alone.

5. Overall Song Insights
Give a concise summary for the listener.

IMPORTANT:
- Use the provided ML prediction and measurements.
- Do not invent instruments, lyrics, artists, or musical events.
- Treat genre probabilities as model scores, not guaranteed confidence.
- Use simple language.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return response.text