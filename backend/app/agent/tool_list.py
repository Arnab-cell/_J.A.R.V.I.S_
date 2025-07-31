from ..tools.jokes import get_joke
from ..services.chatbot import ChatBot
# from ..tools.music import SpotifyClient
# from ..tools.news import get_news
# from ..tools.web_search import web_search
from langchain.agents import Tool

# List of tools available for the agent
TOOL_LIST = [
    Tool(
    name="get_joke",
    func=get_joke,
    description="Get a random joke.",
    ),
    Tool(
        name="ChatBot",
        func=lambda query: ChatBot(query),  # Directly call the ChatBot function with the input query
        description="Send a user query to the Jarvis AI and receive a conversational response.",
    )
    # add more tools
]