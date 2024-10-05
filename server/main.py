from fastapi import FastAPI
from pydantic import BaseModel

# Define a FastAPI app
app = FastAPI()

# Define the data model for the incoming JSON payload
class WeightData(BaseModel):
    weight: float

# Define the API endpoint to receive the weight data
@app.post("/api/weight")
async def receive_weight(data: WeightData):
    # Log or process the received weight data
    print(f"Received weight data: {data.weight}")
    
    # You can also store or process the data here
    return {"status": "success", "received_weight": data.weight}

