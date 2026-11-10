import os
import kagglehub
from backend.audio_analyzer import analyze_audio

dataset_path = kagglehub.dataset_download(
    "andradaolteanu/gtzan-dataset-music-genre-classification"
)

audio_path = os.path.join(
    dataset_path,
    "Data",
    "genres_original",
    "blues",
    "blues.00000.wav"
)

result = analyze_audio(audio_path)

print("\nSONGLENS AUDIO ANALYSIS")
print("-----------------------------")

print("Predicted Genre:", result["predicted_genre"])

print("\nGenre Probabilities:")

for genre, probability in result["genre_probabilities"].items():
    print(f"{genre}: {probability}%")
    