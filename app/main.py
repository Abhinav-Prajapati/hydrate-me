from fastapi import FastAPI
from app.routes.routes import router

# Initialize FastAPI app with custom Swagger UI configuration
app = FastAPI(
    title="Water Intake API",
    description="API for managing water intake for users with IoT devices",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI URL
    redoc_url="/redoc"  # ReDoc URL
)

# Include routes from routes.py
app.include_router(router, prefix="")

# The entry point for running the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="192.168.0.114", port=8001)

