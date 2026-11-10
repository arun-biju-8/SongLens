import joblib

saved = joblib.load(
    "backend/models/genre_classifier.joblib"
)

print("Number of features:", len(saved["features"]))

print("\nFeatures used by the model:")

for feature in saved["features"]:
    print(feature)