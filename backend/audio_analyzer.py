import librosa
import numpy as np
import pandas as pd
import joblib

MODEL_PATH = "backend/models/genre_classifier.joblib"


def extract_features(audio_path):
    y, sr = librosa.load(audio_path)

    features = {}

    features["length"] = len(y)

    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    rms = librosa.feature.rms(y=y)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
    rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    zero_crossing_rate = librosa.feature.zero_crossing_rate(y)

    harmony, perceptr = librosa.effects.hpss(y)

    tempo = librosa.feature.tempo(y=y, sr=sr)[0]

    feature_arrays = {
        "chroma_stft": chroma,
        "rms": rms,
        "spectral_centroid": spectral_centroid,
        "spectral_bandwidth": spectral_bandwidth,
        "rolloff": rolloff,
        "zero_crossing_rate": zero_crossing_rate,
        "harmony": harmony,
        "perceptr": perceptr
    }

    for name, values in feature_arrays.items():
        features[f"{name}_mean"] = np.mean(values)
        features[f"{name}_var"] = np.var(values)

    features["tempo"] = tempo

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)

    for i in range(20):
        features[f"mfcc{i+1}_mean"] = np.mean(mfcc[i])
        features[f"mfcc{i+1}_var"] = np.var(mfcc[i])

    return features


def analyze_audio(audio_path):

    saved = joblib.load(MODEL_PATH)

    model = saved["model"]
    feature_names = saved["features"]

    extracted_features = extract_features(audio_path)

    input_data = pd.DataFrame(
        [[extracted_features[name] for name in feature_names]],
        columns=feature_names
    )

    prediction = model.predict(input_data)[0]
    probabilities = model.predict_proba(input_data)[0]

    genre_probabilities = {
        genre: round(float(probability) * 100, 2)
        for genre, probability in zip(model.classes_, probabilities)
    }

    return {
    "predicted_genre": str(prediction),
    "genre_probabilities": genre_probabilities,
    "features": {
        key: float(value)
        for key, value in extracted_features.items()
    }
}