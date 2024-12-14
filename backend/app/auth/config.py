from dotenv import load_dotenv
import os 

load_dotenv(".env")

JWT_KEY=os.getenv("JWT_KEY", "The default key")


