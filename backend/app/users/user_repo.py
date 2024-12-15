# repository/user_repository.py
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.models import Users, WaterIntake
import uuid


def get_user_by_id(db: Session, user_id: uuid.UUID):
    """Fetch a user by their UUID."""
    return db.query(Users).filter(Users.supabase_user_id == user_id).first()


def add_water_intake(
    db: Session, user_id: uuid.UUID, sensor_id: str, water_intake: int
):
    """
    Add a new water intake entry for the user.
    """
    new_intake = WaterIntake(
        supabase_user_id=user_id,
        sensor_id=sensor_id,
        water_intake_in_ml=water_intake,
        timestamp=datetime.utcnow(),
    )
    db.add(new_intake)
    db.commit()
    db.refresh(new_intake)
    return new_intake
