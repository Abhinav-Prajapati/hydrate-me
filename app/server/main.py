from app.server.repositories.water_level_repository import WaterLevelRepository
from app.database.db import get_db_session

# Use `with` to manage the database session
with get_db_session() as db_session:
    # Create an instance of the WaterLevelRepository class
    repo = WaterLevelRepository(db_session)

    # Call the add_user method
    repo.add_user("Abhinav", "esp32-n2vf7inz")