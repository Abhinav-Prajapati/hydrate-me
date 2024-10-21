from sqlalchemy import func
from datetime import datetime, timedelta
from app.database.models import SensorData, Users
from typing import List, Tuple, Dict, Union, Optional

class UserRepository:

    def __init__(self, db_session):
        self.db_session = db_session

    def get_user_info(self, user_ID: int) -> Dict[str, Union[int, str, float, None]]:
        """
        Fetches and returns the user information based on the provided user ID.
        
        This function queries the database to retrieve the user with the specified `user_ID`. 
        If the user is found, it returns a dictionary containing the user's ID, name, associated 
        IoT device ID (sensor_id), daily goal, wakeup time, sleep time, bottle weight, age, weight,
        height, and gender. If the user is not found, it returns an error message.
        
        Args:
            user_ID (int): The ID of the user whose information is being fetched.

        Returns:
            Dict[str, Union[int, str, float, None]]: A dictionary containing:
                - "id" (int): The user's ID.
                - "name" (str): The user's name.
                - "sensor_id" (str): The associated IoT device ID.
                - "daily_goal" (int, optional): The user's daily goal for water intake.
                - "wakeup_time" (str, optional): The user's wakeup time in 'HH:MM:SS' format.
                - "sleep_time" (str, optional): The user's sleep time in 'HH:MM:SS' format.
                - "bottle_weight" (int, optional): The weight of the user's water bottle.
                - "age" (int, optional): The user's age.
                - "weight" (float, optional): The user's weight.
                - "height" (float, optional): The user's height.
                - "gender" (str, optional): The user's gender.
                - "error" (str): If the user is not found, an error message is returned.
        """
        user = self.db_session.query(Users).filter_by(id=user_ID).first()  
        if user:
            return {
                "id": user.id, 
                "name": user.name,
                "sensor_id": user.sensor_id,
                "daily_goal": user.daily_goal,
                "wakeup_time": user.wakeup_time.strftime('%H:%M:%S') if user.wakeup_time else None,
                "sleep_time": user.sleep_time.strftime('%H:%M:%S') if user.sleep_time else None,
                "bottle_weight": user.bottle_weight,
                "age": user.age,
                "weight": user.weight,
                "height": user.height,
                "gender": user.gender,
                "currect_water_level_in_bottle": user.currect_water_level_in_bottle,
                "is_bottle_on_dock": user.is_bottle_on_dock,
            }
        else:
            return {"error": "User not found"}

    def update_user_info(self, user_ID: int, key: str, value: Union[str, int, float, None]) -> Dict[str, str]:
        """
        Updates the user's data based on the provided key-value pair.

        This function allows updating a specific field in the user's information by passing the field name (key)
        and the new value. If the user is found, the field is updated, and the change is committed to the database.

        Args:
            user_ID (int): The ID of the user to update.
            key (str): The field to update (e.g., 'name', 'age', 'daily_goal').
            value (Union[str, int, float, None]): The new value to set for the specified field.

        Returns:
            Dict[str, str]: A dictionary containing:
                - "success" (str): A message indicating success.
                - "error" (str, optional): If an error occurs (e.g., user not found or invalid key), an error message is returned.
        """

        user = self.db_session.query(Users).filter_by(id=user_ID).first()

        if not user:
            return {"error": "User not found"}

        # Check if the attribute exists on the user model
        if not hasattr(user, key):
            return {"error": f"Invalid field: {key}"}

        # Dynamically set the attribute value
        setattr(user, key, value)

        try:
            # Commit the changes to the database
            self.db_session.commit()
            return {"success": f"User {key} updated successfully"}
        except Exception as e:
            self.db_session.rollback()
            return {"error": str(e)}

    def get_iot_device_id(self, user_ID: int) -> Optional[str]:
        """
        Fetches the IoT device ID (sensor_id) associated with the given user.

        This function queries the database for the user with the provided user ID and 
        retrieves their associated IoT device ID (sensor_id). If the user is not found, 
        it raises a ValueError.

        Args:
            user_ID (int): The ID of the user whose IoT device ID is being fetched.

        Returns:
            Optional[int]: The sensor_id (IoT device ID) associated with the user. 
                        Returns None if the user has no associated sensor_id.
        
        Raises:
            ValueError: If no user is found with the provided user ID.
        """
        user = self.db_session.query(Users).filter_by(id=user_ID).one_or_none()

        if user:
            return user.sensor_id
        else:
            raise ValueError(f"User with ID {user_ID} not found")


    def get_today_water_intake(self, iot_device_ID: str) -> List[Tuple[str, float]]:
        """
        Retrieves today's water intake records for the given device ID.
        
        This function queries the database for all records of water intake for the current
        date associated with the specified IoT device ID. It returns a list of tuples where
        each tuple contains the timestamp in the format 'YYYY-MM-DD HH:MM:SS' and the water 
        intake data converted to a float.

        Args:
            iot_device_ID (int): The ID of the IoT device whose water intake data is being fetched.

        Returns:
            List[Tuple[str, float]]: A list of tuples where each tuple contains:
                                    - timestamp (str): The time of the water intake in 'YYYY-MM-DD HH:MM:SS' format.
                                    - data (float): The water intake data as a float.
        """
        today = datetime.utcnow().date()

        results = self.db_session.query(SensorData)\
            .filter_by(sensor_id=iot_device_ID)\
            .filter(func.date(SensorData.timestamp) == today)\
            .all() 

        result_list = [(entry.timestamp.strftime('%Y-%m-%d %H:%M:%S'), float(entry.data)) for entry in results]
        
        return result_list


    def get_week_water_intake(self, iot_device_ID: str) -> List[Tuple[str, float]]:
        """
        Retrieves all water intake records for the past week for the given device ID.
        
        This function queries the database for all records of water intake between the past 
        week (starting from one week ago until today) associated with the specified IoT 
        device ID. It returns a list of tuples where each tuple contains the timestamp in 
        the format 'YYYY-MM-DD HH:MM:SS' and the water intake data converted to a float.

        Args:
            iot_device_ID (int): The ID of the IoT device whose water intake data is being fetched.

        Returns:
            List[Tuple[str, float]]: A list of tuples where each tuple contains:
                                    - timestamp (str): The time of the water intake in 'YYYY-MM-DD HH:MM:SS' format.
                                    - data (float): The water intake data as a float.
        """
        today = datetime.utcnow().date()
        one_week_ago = today - timedelta(days=7)

        results = self.db_session.query(SensorData)\
            .filter_by(sensor_id=iot_device_ID)\
            .filter(SensorData.timestamp >= one_week_ago)\
            .all()  

        result_list = [(entry.timestamp.strftime('%Y-%m-%d %H:%M:%S'), float(entry.data)) for entry in results]

        return result_list


    def get_sensor_data_by_id(self, iot_device_ID: str) -> List[Tuple[str,float]]:
        """
        Fetches all sensor readings filtered by the given device ID (sensor_id).
        
        This function queries the database for all sensor data records that match the
        provided IoT device ID (sensor_id). It returns a list of SensorData objects, 
        which contain the readings for that specific sensor.

        Args:
            iot_device_ID (int): The ID of the IoT device (sensor) whose readings are to be fetched.

        Returns:
            List[Tuple[str, float]]: A list of tuples where each tuple contains:
                                    - timestamp (str): The time of the water intake in 'YYYY-MM-DD HH:MM:SS' format.
                                    - data (float): The water intake data as a float.
        """
        results = self.db_session.query(SensorData)\
            .filter_by(sensor_id=iot_device_ID)\
            .all()

        result_list = [(entry.timestamp.strftime('%Y-%m-%d %H:%M:%S'), float(entry.data)) for entry in results]

        return results

    def get_latest_sensor_data(self, sensor_id: str) -> Optional[SensorData]:
        """
        Fetches the most recent sensor data entry for the given sensor ID.

        Args:
            sensor_id (str): The ID of the IoT sensor device.

        Returns:
            SensorData: The most recent sensor data entry, or None if no data is found.
        """
        try:
            return self.db_session.query(SensorData).filter_by(sensor_id=sensor_id).order_by(SensorData.timestamp.desc()).first()
        except Exception as e:
            print(f"Error fetching latest sensor data for {sensor_id}: {e}")
            return None
