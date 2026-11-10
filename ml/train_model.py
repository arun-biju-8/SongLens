import kagglehub
import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

import matplotlib.pyplot as plt
import seaborn as sns

# Download / locate dataset
path = kagglehub.dataset_download(
    "andradaolteanu/gtzan-dataset-music-genre-classification"
)

csv_path = os.path.join(path, "Data", "features_30_sec.csv")

# Load dataset
df = pd.read_csv(csv_path)

# Prepare features and target
X = df.drop(columns=["label", "filename"], errors="ignore")
X = X.select_dtypes(include="number")

y = df["label"]

# Handle missing values
X = X.fillna(X.median())

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Train Random Forest
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Evaluation
accuracy = accuracy_score(y_test, y_pred)

print("\nMODEL EVALUATION")
print("-------------------------")
print(f"Accuracy: {accuracy * 100:.2f}%")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred, labels=model.classes_)

plt.figure(figsize=(10, 7))
sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    xticklabels=model.classes_,
    yticklabels=model.classes_,
    cmap="Blues"
)

plt.title("SongLens - Genre Classification")
plt.xlabel("Predicted Genre")
plt.ylabel("Actual Genre")
plt.tight_layout()

os.makedirs("ml/results", exist_ok=True)
plt.savefig("ml/results/confusion_matrix.png")
plt.close()

# Save model and feature information
os.makedirs("backend/models", exist_ok=True)

joblib.dump(
    {
        "model": model,
        "features": X.columns.tolist()
    },
    "backend/models/genre_classifier.joblib"
)

print("\nModel saved successfully!")
print("Location: backend/models/genre_classifier.joblib")
print("Confusion matrix saved successfully!")