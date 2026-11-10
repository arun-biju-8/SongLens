from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

print("\nAVAILABLE GEMINI MODELS")
print("=" * 50)

for model in client.models.list():
    actions = model.supported_actions or []

    if "generateContent" in actions:
        print(f"Model: {model.name}")
        print(f"Supported actions: {actions}")
        print("-" * 40)