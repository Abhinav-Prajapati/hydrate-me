
from fastapi import FastAPI
from app.routes.routes import router
from app.paho_mqtt.mqtt import run_subscriber
import threading
from utils import setup_loguru_for_fastapi  # Import logger setup

# Initialize FastAPI app
setup_loguru_for_fastapi()  # Apply logging configuration
app = FastAPI(
    title="Water Intake API",
    description="API for managing water intake for users with IoT devices",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI URL
    redoc_url="/redoc"  # ReDoc URL
)

# Include routes from routes.py
app.include_router(router, prefix="")

@app.get("/")
def home():
    return {"message": "Hello, HTTP and MQTT!"}

# Start the MQTT subscriber in a separate thread
def start_mqtt():
    mqtt_thread = threading.Thread(target=run_subscriber)
    mqtt_thread.daemon = True  # Ensures the thread will exit when the main process ends
    mqtt_thread.start()

if __name__ == "__main__":
    start_mqtt()  
    import uvicorn
    uvicorn.run(app, host="192.168.0.114", port=8000, log_config=None)  # Disable Uvicorn's default log config
