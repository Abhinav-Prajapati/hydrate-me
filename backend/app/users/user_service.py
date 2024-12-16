# services/user_service.py
from sqlalchemy.orm import Session
from app.users.user_repo import add_water_intake, get_user_by_id
import uuid
from fastapi import HTTPException


def retrieve_user_data(db: Session, user_uuid: str):
    """Retrieve user data from the database."""
    user_id = uuid.UUID(user_uuid)  # Convert string to UUID

    db_user = get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Format the user data to return
    return {
        "username": db_user.username,
        "sensor_id": db_user.sensor_id,
        "currect_water_level_in_bottle": db_user.currect_water_level_in_bottle,
        "todays_water_intake_in_ml": db_user.todays_water_intake_in_ml,
        "bottle_weight": db_user.bottle_weight,
        "is_bottle_on_dock": db_user.is_bottle_on_dock,
        "daily_goal": db_user.daily_goal,
        "wakeup_time": db_user.wakeup_time,
        "sleep_time": db_user.sleep_time,
        "age": db_user.age,
        "weight": db_user.weight,
        "height": db_user.height,
        "gender": db_user.gender,
    }


def add_consumption_for_user(
    db: Session, user_uuid: str, sensor_id: str, water_intake_in_ml: int
):
    """
    Add water consumption for the user, ensuring the user exists.
    """
    user_id = uuid.UUID(user_uuid)

    db_user = get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    water_record = add_water_intake(db, user_id, sensor_id, water_intake_in_ml)

    return {
        "user_id": str(user_id),
        "water_intake_in_ml": water_record.water_intake_in_ml,
        "timestamp": water_record.timestamp,
    }


def get_user_water_data(db: Session, user_uuid: str):
    """Get user's water related data"""
    user_id = uuid.UUID(user_uuid)
    db_user = get_user_by_id(db, user_id)

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "currect_water_level_in_bottle": db_user.currect_water_level_in_bottle,
        "daily_goal": db_user.daily_goal,
        "todays_water_intake_in_ml": db_user.todays_water_intake_in_ml,
        "is_bottle_on_dock": db_user.is_bottle_on_dock,
    }
