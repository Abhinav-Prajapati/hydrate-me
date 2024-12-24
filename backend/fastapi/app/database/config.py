
from dotenv import load_dotenv
import os

load_dotenv(".env")  # Loads .env file containing both URLs

if os.getenv("ENV") == "production": # dev/production
    DATABASE_URL = os.getenv("PROD_DATABASE_URL")
else:
    DATABASE_URL = os.getenv("DEV_DATABASE_URL")
