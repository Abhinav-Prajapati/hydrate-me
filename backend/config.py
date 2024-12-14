from dotenv import load_dotenv
import os

load_dotenv(".env")

SERVER_URL = os.getenv("SERVER_URL", "localhost")
SERVER_PORT = int(os.getenv("SERVER_PORT", "8000"))

SERVER_USER = os.getenv("SERVER_USER", "")
SERVER_USER_PASSWORD = os.getenv("SERVER_USER_PASSWORD", "")

if os.getenv("ENV") == "production":  # dev/production
    SERVER_URL = os.getenv("SERVER_URL_PROD", "")
    SERVER_PORT = int(os.getenv("SERVER_PORT_PROD", "8443"))
else:
    SERVER_URL = os.getenv("SERVER_URL", "localhost")
    SERVER_PORT = int(os.getenv("SERVER_PORT", "8000"))

# Second parameter passed to os.getenv() are default values
