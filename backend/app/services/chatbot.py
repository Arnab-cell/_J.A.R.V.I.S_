import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# API
API_KEY = os.getenv("DEEPSEEK_API_KEY")


def ChatBot(query):
    # api_key = os.getenv("OPENROUTER_API_KEY")  # Store your API key in an environment variable
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "deepseek/deepseek-r1:free",
        "messages": [
            {
                "role": "user",
                "content": query
            }
        ],
    }
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            data=json.dumps(payload)
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"error": str(e)}

# print("ChatBot service initialized.")
# This function can be used to interact with the ChatBot service
# Example usage:
# print(ChatBot("Who are you?")["choices"][0]["message"]["content"])
