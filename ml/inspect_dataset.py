import kagglehub
import pandas as pd
import os

# Get dataset location
path = kagglehub.dataset_download(
    "andradaolteanu/gtzan-dataset-music-genre-classification"
)

# Locate CSV
csv_path = os.path.join(
    path, "Data", "features_30_sec.csv"
)

# Load dataset
df = pd.read_csv(csv_path)

print("\nDATASET SHAPE:")
print(df.shape)

print("\nCOLUMN NAMES:")
print(df.columns.tolist())

print("\nFIRST 5 ROWS:")
print(df.head())

print("\nGENRE DISTRIBUTION:")
print(df["label"].value_counts())