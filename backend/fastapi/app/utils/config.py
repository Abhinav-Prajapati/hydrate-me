from dotenv import load_dotenv
import os

load_dotenv(".env")

if os.getenv("ENV") == "production": 
    PRIVATE_JWT_KEY = os.getenv("JWT")
else:
    PRIVATE_JWT_KEY = os.getenv("JWT")
