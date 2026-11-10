import joblib
import kagglehub
import pandas as pd
import os

# Load dataset
path = kagglehub.dataset_download(
    "andradaolteanu/gtzan-dataset-music-genre-classification"
)

csv_path = os.path.join(path, "Data", "features_30_sec.csv")
df = pd.read_csv(csv_path)

# Load trained model
saved = joblib.load("backend/models/genre_classifier.joblib")

model = saved["model"]
features = saved["features"]

# Select one sample
sample = df.iloc[[0]]

X = sample[features]

# Predict genre
prediction = model.predict(X)[0]
probabilities = model.predict_proba(X)[0]

print("Predicted Genre:", prediction)

print("\nGenre Probabilities:")

for genre, probability in zip(model.classes_, probabilities):
    print(f"{genre}: {probability * 100:.2f}%")