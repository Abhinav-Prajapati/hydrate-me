from app.database.models import SensorData
from datetime import datetime

class WaterLevelRepository:
    def __init__(self, db_session):
        self.db_session = db_session

    def add_sensor_data(self, sensor_id, data):
        new_data = SensorData(
            sensor_id=sensor_id,
            data=data,
            timestamp=datetime.utcnow()  # This will use the current timestamp
        )
        self.db_session.add(new_data)
        self.db_session.commit()

    # New method to get all sensor data
    def get_all_sensor_data(self):
        return self.db_session.query(SensorData).all()

    # Method to get sensor data filtered by sensor_id (optional)
    def get_sensor_data_by_id(self, sensor_id):
        return self.db_session.query(SensorData).filter_by(sensor_id=sensor_id).all()