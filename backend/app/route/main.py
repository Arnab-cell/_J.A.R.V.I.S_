# ############################ ( Imports Section ) #############################

# imports for API development
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# imports for loading environment variables
from dotenv import load_dotenv
import os
# imports for logging
import logging

# importing Chatbot
from ..services.chatbot import ChatBot

# ############################ ( Initialization Section ) #############################

# Load environment variables from .env file
load_dotenv()

# Initializing logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app instance
app = FastAPI(title="J.A.R.V.I.S. API", version="1.0.0")

# CORS setup
origin = os.getenv("CORS_ORIGIN", "*")  # Default to '*' if not set

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ####################### ( API Endpoints Section ) #######################

# Health check endpoint
@app.get("/")
async def check():
    """
    Health check endpoint to verify if the API is running.
    """
    return {"status": "API is running"}

    
@app.get("/ask")
async def ask_from_agent(request: Request):
    """
    Endpoint to handle user queries and return responses from the J.A.R.V.I.S. agent.
    """
    try:
        body = await request.json()
        # Extract query parameters
        query = body.get("query")
        if not query:
            raise HTTPException(status_code=400, detail="Query parameter 'query' is required")

        # #################### ( Main Function for answering questions ) ##############

        response = ChatBot("Who are you?")["choices"][0]["message"]["content"]

        return JSONResponse(content=response) # Formating in JSON

    except Exception as e:
        logger.error(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
