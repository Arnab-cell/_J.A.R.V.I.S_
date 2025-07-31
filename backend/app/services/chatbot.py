import requests
import json
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

# API
API_KEY = os.getenv("API_KEY") # Loading API key from .env


def ChatBot(query):
    try:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=f"{API_KEY}",
        )

        completion = client.chat.completions.create(
            model="deepseek/deepseek-r1-0528:free",
            messages=[
                {
                "role": "user",
                "content": query
                }
            ]
        )

        # Getting fresh response without metadata
        response = completion.choices[0].message.content
        
        return response
    except requests.RequestException as e:
        return {"error": str(e)}

# print("ChatBot service initialized.")
# # This function can be used to interact with the ChatBot service
# # Example usage:
# print(ChatBot("Who are you?"))