from typing import Optional, List, Union
from app.database.models import SensorData, Users
from datetime import datetime
from sqlalchemy.orm import Session

class WaterLevelRepository:
    def __init__(self, db_session: Session):
        """
        Initializes the WaterLevelRepository with a database session.
        Args:
            db_session (Session): SQLAlchemy session object used for database interactions.
        """
        self.db_session = db_session

    def add_sensor_data(self, sensor_id: str, data: float) -> None:
        """
        Adds new sensor data to the database.
        Args:
            sensor_id (str): The ID of the sensor providing the data.
            data (float): The water level or weight data to be recorded.

        Returns:
            None
        """
        new_data = SensorData(
            sensor_id=sensor_id,
            data=data,
            timestamp=datetime.utcnow()
        )
        self.db_session.add(new_data)
        self.db_session.commit()

    def get_all_sensor_data(self) -> List[SensorData]:
        """
        Retrieves all sensor data from the database.
        Returns:
            List[SensorData]: A list of all sensor data records in the database.
        """
        return self.db_session.query(SensorData).all()

    def get_bottle_weight_by_sensor(self, sensor_id: str) -> int:
        """
        Fetches and returns the user's bottle weight based on the provided sensor ID.
        Args:
            sensor_id (str): The sensor ID associated with the user whose bottle weight is being fetched.
        Returns:
            Optional[float]: The user's bottle weight if found, or None if the user is not found.
        Raises:
            ValueError: If no user is found for the given sensor ID.
        """
        user = self.db_session.query(Users).filter_by(sensor_id=sensor_id).first()

        if user:
            return user.bottle_weight
        else:
            raise ValueError(f"User not found with the given sensor ID: {sensor_id}")
            
    def update_is_bottle_picked(self, sensor_id: str, is_picked_up: bool) -> None:
        """
        Updates the 'is_bottle_on_dock' field for the user associated with the given sensor ID.

        Args:
            sensor_id (str): The sensor ID associated with the user whose bottle status is being updated.
            is_picked_up (bool): True if the bottle is picked up (not on the dock), False if the bottle is on the dock.

        Returns:
            None
        Raises:
            ValueError: If no user is found with the given sensor ID.
        """
        user = self.db_session.query(Users).filter_by(sensor_id=sensor_id).first()

        if user:
            user.is_bottle_on_dock = not is_picked_up  
            self.db_session.commit()
        else:
            raise ValueError(f"User not found with the given sensor ID: {sensor_id}")
