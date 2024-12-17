# repository/user_repository.py
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app.database.models import Users, WaterIntake
import uuid


def get_user_by_id(db: Session, user_id: uuid.UUID):
    """Fetch a user by their UUID."""
    return db.query(Users).filter(Users.id == user_id).first()


def add_water_intake(
    db: Session,
    user_id: uuid.UUID,
    sensor_id: str,
    water_intake: int,
    time: Optional[datetime] = datetime.utcnow(),
):
    """
    Add a new water intake entry for the user.
    """
    new_intake = WaterIntake(
        supabase_user_id=user_id,
        sensor_id=sensor_id,
        water_intake_in_ml=water_intake,
        timestamp=time,
    )
    db.add(new_intake)
    db.commit()
    db.refresh(new_intake)
    return new_intake


def update_user_profile(
    db: Session,
    user_id: uuid.UUID,
    username: Optional[str] = None,
    sensor_id: Optional[str] = None,
    currect_water_level_in_bottle: Optional[int] = None,
    bottle_weight: Optional[int] = None,
    is_bottle_on_dock: Optional[bool] = None,
    daily_goal: Optional[int] = None,
    todays_water_intake_in_ml: Optional[int] = None,
    wakeup_time: Optional[datetime.time] = None,
    sleep_time: Optional[datetime.time] = None,
    age: Optional[int] = None,
    weight: Optional[float] = None,
    height: Optional[float] = None,
    gender: Optional[str] = None,
):
    """
    Update the user profile with the provided values.
    Only updates fields with non-None values.
    """
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        return None

    update_data = {
        "username": username,
        "sensor_id": sensor_id,
        "currect_water_level_in_bottle": currect_water_level_in_bottle,
        "bottle_weight": bottle_weight,
        "is_bottle_on_dock": is_bottle_on_dock,
        "daily_goal": daily_goal,
        "todays_water_intake_in_ml": todays_water_intake_in_ml,
        "wakeup_time": wakeup_time,
        "sleep_time": sleep_time,
        "age": age,
        "weight": weight,
        "height": height,
        "gender": gender,
    }
    update_data = {
        key: value for key, value in update_data.items() if value is not None
    }

    # Apply the updates dynamically
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user
