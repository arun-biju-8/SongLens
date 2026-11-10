import os
import numpy as np
import pandas as pd
import librosa
import kagglehub

# Download / locate GTZAN dataset
dataset_path = kagglehub.dataset_download(
    "andradaolteanu/gtzan-dataset-music-genre-classification"
)

csv_path = os.path.join(dataset_path, "Data", "features_30_sec.csv")
df = pd.read_csv(csv_path)

# Select the first audio track
sample = df.iloc[0]
filename = sample["filename"]
genre = sample["label"]

audio_path = os.path.join(
    dataset_path,
    "Data",
    "genres_original",
    genre,
    filename
)

print("Testing audio:", filename)
print("Actual genre:", genre)

# Load audio
y, sr = librosa.load(audio_path)

# Extract audio features
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

# Compare extracted features with the original CSV values
print("\nFEATURE COMPARISON")
print("-" * 65)

differences = []

for feature_name, extracted_value in features.items():
    original_value = sample[feature_name]
    difference = abs(float(original_value) - float(extracted_value))
    differences.append(difference)

    print(
        f"{feature_name:25} "
        f"CSV: {float(original_value):12.4f} "
        f"Extracted: {float(extracted_value):12.4f} "
        f"Difference: {difference:.4f}"
    )

print("\nMaximum difference:", max(differences))
print("Average difference:", np.mean(differences))