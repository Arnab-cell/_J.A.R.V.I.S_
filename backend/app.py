# Tihis is the entry point for the FastAPI application.
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app") # uvicorn will look for the app instance in the main module of the app package