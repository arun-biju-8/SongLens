from backend.ai_analyzer import generate_music_analysis

sample_analysis = {
    "predicted_genre": "blues",
    "genre_probabilities": {
        "blues": 65.0,
        "reggae": 10.0,
        "rock": 15.0
    },
    "features": {
        "tempo": 123.04,
        "rms_mean": 0.13,
        "spectral_centroid_mean": 1784.16,
        "rolloff_mean": 3805.83
    }
}

result = generate_music_analysis(sample_analysis)

print("\nSONGLENS - AI MUSIC ANALYSIS")
print("=" * 50)
print(result)