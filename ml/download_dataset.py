import kagglehub
import os

path = kagglehub.dataset_download(
    "andradaolteanu/gtzan-dataset-music-genre-classification"
)

print("\nDATASET LOCATION:", path)

print("\nDATASET STRUCTURE:")

for root, dirs, files in os.walk(path):
    level = root.replace(path, "").count(os.sep)

    if level <= 2:
        indent = " " * 4 * level
        print(f"{indent}{os.path.basename(root)}/")

        if level < 2:
            for file in files[:5]:
                print(f"{indent}    {file}")

print("\nInspection completed!")