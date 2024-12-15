from app.users.user_router import router as user_routers
from starlette.middleware.cors import CORSMiddleware

from fastapi import FastAPI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, or specify a list of allowed origins like ["http://example.com"]
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)
#app.include_router(mqtt_router, prefix="/mqtt", tags=["mqtt"])
app.include_router(user_routers, prefix="/user", tags=["users"])

if __name__ == "__main__":
    import uvicorn
    # TODO: add error handling for mqtt client (if it does not starts)
    #run_mqtt_client()
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
