import requests
import os
from dotenv import load_dotenv
# from music import SpotifyClient

load_dotenv()

def get_joke():
    """Fetch a random joke from the JokeAPI."""
    url = os.getenv("Joke_URI")  # Fetch the joke URL from environment variables
    if not url:
        return "Error: Joke_URI environment variable is not set."
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad responses
        return response.text
    except requests.RequestException as e:
        return f"Error fetching joke: {e}"

