# ############################ ( Imports Section ) #############################

# imports for API development
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Body

# imports for loading environment variables
from dotenv import load_dotenv
import os
# imports for logging
import logging

# importing Chatbot and agent
from .services.chatbot import ChatBot
from .agent.agent import JarvisAgent  # Importing the JarvisAgent class


# ############################ ( Initialization Section ) #############################

# Load environment variables from .env file
load_dotenv()

# Initializing logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app instance
app = FastAPI(title="J.A.R.V.I.S. API", version="1.0.0")

# CORS setup for allowing cross-origin requests
# This is useful for development when the frontend and backend are on different ports
origin = os.getenv("CORS_ORIGIN", "*")  # Default to '*' if not set

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Jarvis Agent instance
jarvis_agent = JarvisAgent()

# ####################### ( API Endpoints Section ) #######################

# Health check endpoint
@app.get("/")
async def check():
    """
    Health check endpoint to verify if the API is running.
    """
    return {"status": "API is running"}


# Example of how to send data to this API using Python requests:
#
# import requests
# url = "http://localhost:8000/ask"
# payload = {"query": "Hello, J.A.R.V.I.S.!"}
# response = requests.post(url, json=payload)
# print(response.json())

# Example of how to test this API using Thunder Client (VS Code extension):
#
# 1. Open Thunder Client in VS Code.
# 2. Create a new POST request.
# 3. Set the URL to: http://localhost:8000/ask
# 4. In the "Body" tab, select "JSON" and enter:
#    {
#      "query": "Hello, J.A.R.V.I.S.!"
#    }
# 5. Click "Send" to see the response.


@app.post("/ask")
async def ask_from_agent_post(body: dict = Body(...)):
    """
    Endpoint to handle user queries via POST request and return responses from the J.A.R.V.I.S. agent.
    """
    try:
        query = body.get("query") # getting query from the request body


        if not query:
            raise HTTPException(status_code=400, detail="Query parameter 'query' is required")

        # Now Using our LangChain agent to process the query
        response = jarvis_agent.run_agent(query)

        if response is None:
            # logger.error(f"Unexpected ChatBot response: {bot_response}")
            raise HTTPException(status_code=500, detail="Invalid response from ChatBot")

        return JSONResponse(content={"response": response}) # Giving the response in JSON format

    except Exception as e:
        logger.error(f"Error processing request: {e}")
        print(e)
        raise HTTPException(status_code=500, detail="Internal Server Error")


