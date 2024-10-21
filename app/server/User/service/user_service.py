from sqlalchemy import false
from app.server.User.repositories.user_repository import UserRepository
from app.database.models import Users
from typing import List, Tuple, Dict, Union, Optional

class UserService:
    def __init__(self,DB_session,user_id):
        self.__repository = UserRepository(db_session=DB_session)
        self.user_ID = user_id
        self.iot_device_ID = self.__repository.get_iot_device_id(user_id) 

    def get_user_info(self):
        """
        Fetch user information from the repository
        """
        try:
            result = self.__repository.get_user_info(self.user_ID)
            return result
        except Exception as e:
            raise ValueError(f"Error fetching user info: {e}")

    def get_today_water_intake(self):
        """
        Get today's water intake from the repository
        """
        try:
            result = self.__repository.get_today_water_intake(self.iot_device_ID)
            return result
        except Exception as e:
            raise ValueError(f"Error fetching today's water intake: {e}")

    def get_week_water_intake(self):
        """
        Get this week's water intake from the repository
        """
        try:
            result = self.__repository.get_week_water_intake(self.iot_device_ID)
            return result
        except Exception as e:
            raise ValueError(f"Error fetching weekly water intake: {e}")

    def get_sensor_data(self):
        """
        Get all sensor data associated with the IoT device
        """
        try:
            result = self.__repository.get_sensor_data_by_id(self.iot_device_ID)
            return result
        except Exception as e:
            raise ValueError(f"Error fetching sensor data: {e}")

    def get_todays_total_water_intake(self):
        """
        Get today's total water intake
        """
        total_water_consumed_today = 0.0

        try:
            result = self.__repository.get_today_water_intake(self.iot_device_ID)
            for entry in result:
                total_water_consumed_today += entry[1]
            return round(total_water_consumed_today,2)
        except Exception as e:
            raise ValueError(f"Error fetching today's water intake: {e}")

    def set_daily_goal(self, new_daily_goal: int):
        """
        Updates the user's daily water intake goal.

        Args:
            new_goal (int): The new daily goal for water intake.

        Returns:
            str: Success message or error message.
        """
        result = self.__repository.update_user_info(user_ID=self.user_ID, key='daily_goal', value=new_daily_goal)
        
        if "success" in result:
            return result["success"] 
        else:
            return result["error"]  

    def get_daily_goal(self) -> Optional[int]:
        """
        Retrieves the user's daily water intake goal.

        Returns:
            Optional[int]: The user's daily water intake goal or None if the user is not found.
        """
        result = self.__repository.get_user_info(user_ID=self.user_ID)
        
        if "error" in result:
            print(result["error"])
            return None
        
        return result.get("daily_goal")

    def get_wakeup_time(self) -> Optional[str]:
        """
        Retrieves the user's wakeup time.

        Returns:
            Optional[str]: The user's wakeup time in 'HH:MM:SS' format or None if not set or user not found.
        """
        result = self.__repository.get_user_info(user_ID=self.user_ID)
        
        if "error" in result:
            print(result["error"])
            return None
        
        return result.get("wakeup_time")

    def set_wakeup_time(self, new_wakeup_time: str):
        """
        Updates the user's wakeup time.

        Args:
            new_wakeup_time (str): The new wakeup time in 'HH:MM:SS' format.

        Returns:
            str: Success message or error message.
        """
        result = self.__repository.update_user_info(user_ID=self.user_ID, key='wakeup_time', value=new_wakeup_time)
        
        if "success" in result:
            return result["success"]
        else:
            return result["error"]

    def get_sleep_time(self) -> Optional[str]:
        """
        Retrieves the user's sleep time.

        Returns:
            Optional[str]: The user's sleep time in 'HH:MM:SS' format or None if not set or user not found.
        """
        result = self.__repository.get_user_info(user_ID=self.user_ID)
        
        if "error" in result:
            print(result["error"])
            return None
        
        return result.get("sleep_time")

    def set_sleep_time(self, new_sleep_time: str):
        """
        Updates the user's sleep time.

        Args:
            new_sleep_time (str): The new sleep time in 'HH:MM:SS' format.

        Returns:
            str: Success message or error message.
        """
        result = self.__repository.update_user_info(user_ID=self.user_ID, key='sleep_time', value=new_sleep_time)
        
        if "success" in result:
            return result["success"]
        else:
            return result["error"]

    def get_weight(self) -> Optional[float]:
        """
        Retrieves the user's weight.

        Returns:
            Optional[float]: The user's weight or None if not set or user not found.
        """
        result = self.__repository.get_user_info(user_ID=self.user_ID)
        
        if "error" in result:
            print(result["error"])
            return None
        
        return result.get("weight")


    def set_weight(self, new_weight: float):
        """
        Updates the user's weight.

        Args:
            new_weight (float): The new weight value.

        Returns:
            str: Success message or error message.
        """
        result = self.__repository.update_user_info(user_ID=self.user_ID, key='weight', value=new_weight)
        
        if "success" in result:
            return result["success"]
        else:
            return result["error"]

    def get_bottle_weight(self) -> Optional[int]:
        """
        Retrieves the user's bottle weight.
        """
        result = self.__repository.get_user_info(user_ID=self.user_ID)
        if "error" in result:
            print(result["error"])
            return None
        return result.get("bottle_weight")

    def set_bottle_weight(self, new_bottle_weight: int):
        """
        Updates the user's bottle weight.
        """
        result = self.__repository.update_user_info(user_ID=self.user_ID, key='bottle_weight', value=new_bottle_weight)
        if "success" in result:
            return result["success"]
        else:
            return result["error"]


    def get_sensor_id(self) -> Optional[str]:
        """
        Retrieves the user's sensor ID.
        """
        result = self.__repository.get_user_info(user_ID=self.user_ID)
        if "error" in result:
            print(result["error"])
            return None
        return result.get("sensor_id")


    def set_sensor_id(self, new_sensor_id: str):
        """
        Updates the user's sensor ID.
        """
        result = self.__repository.update_user_info(user_ID=self.user_ID, key='sensor_id', value=new_sensor_id)
        if "success" in result:
            return result["success"]
        else:
            return result["error"]
    
    def set_current_bottle_water_level(self, current_level: int):
        """
        Updates the current water level in the user's bottle.

        This method updates the `currect_water_level_in_bottle` field in the user's data repository
        with the provided water level.

        Args:
            current_level (int): The current water level in the bottle.

        Returns:
            str: A success message if the update is successful, or an error message if the update fails.
        """
        result = self.__repository.update_user_info(user_ID=self.user_ID, key='currect_water_level_in_bottle', value=current_level)
        
        if "success" in result:
            return result["success"]
        else:
            return result["error"]

    def set_is_bottle_placed_on_dock(self, value: bool):
        """
        Updates the status of whether the bottle is placed on the dock.

        This method updates the `is_bottle_on_dock` field in the user's data repository
        with the provided boolean value, indicating whether the bottle is on the dock.

        Args:
            value (bool): A boolean representing if the bottle is placed on the dock (True or False).

        Returns:
            str: A success message if the update is successful, or an error message if the update fails.
        """
        result = self.__repository.update_user_info(user_ID=self.user_ID, key='is_bottle_on_dock', value=value)
        
        if "success" in result:
            return result["success"]
        else:
            return result["error"]
   
    def get_current_bottle_water_level(self) -> Optional[float]:
        """
        Retrieves the most recent water level reading for the user's bottle.

        This method queries the sensor data for the IoT device associated with the user
        and returns the most recent water level entry.

        Returns:
            float: The most recent water level in the bottle, or None if there is an error or no data is found.
        """
        try:
            # Get the most recent water level reading from the sensor data
            sensor_data = self.__repository.get_latest_sensor_data(self.iot_device_ID)

            if not sensor_data:
                print(f"No sensor data found for device {self.iot_device_ID}")
                return None

            # Assuming the `data` field contains the water level reading
            return sensor_data.data
                
        except Exception as e:
            print(f"Error fetching current bottle water level: {e}")
            return None

    def get_is_bottle_placed_on_dock(self) -> Optional[bool]:
        """
        Retrieves the status of whether the bottle is placed on the dock.

        This method queries the user's information from the repository and 
        returns the `is_bottle_on_dock` field as a boolean.

        Returns:
            bool: True if the bottle is placed on the dock, False if it is not, and None if there is an error.
        """
        result = self.__repository.get_user_info(user_ID=self.user_ID)
        
        if "error" in result:
            print(result["error"])
            return False
        
        return result.get("is_bottle_on_dock")
