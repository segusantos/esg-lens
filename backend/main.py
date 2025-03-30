from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import app modules
from app.routes import router
import app.database

# Create FastAPI app
app = FastAPI(
    title="ESG Lens API",
    description="API para la plataforma ESG Lens que proporciona análisis de informes ESG",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    return {
        "mensaje": "Bienvenido a la API de ESG Lens",
        "documentacion": "/docs",
        "estado": "online"
    }

if __name__ == "__main__":
    # Get port from environment variable or default to 8000
    port = int(os.getenv("PORT", 8000))
    
    # Run the FastAPI application
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)