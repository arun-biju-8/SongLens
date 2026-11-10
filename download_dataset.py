import kagglehub
import os

# Download GTZAN dataset
path = kagglehub.dataset_download(
    "andradaolteanu/gtzan-dataset-music-genre-classification"
)

print("Dataset downloaded successfully!")
print("Dataset location:", path)

# Display downloaded files
for root, dirs, files in os.walk(path):
    print(root, ":", len(files), "files")