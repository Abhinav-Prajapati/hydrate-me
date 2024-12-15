from app.database.db import get_db_session
from app.database.models import Users, WaterIntake
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import time
import uuid

router = APIRouter()

# Pydantic model for user data
class UserModel(BaseModel):
    username: str
    email: EmailStr
    sensor_id: Optional[str] = None
    currect_water_level_in_bottle: Optional[int] = None
    bottle_weight: Optional[int] = None
    is_bottle_on_dock: Optional[bool] = None
    daily_goal: Optional[int] = None
    wakeup_time: Optional[str] = None
    sleep_time: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    gender: Optional[str] = None

# Pydantic model for updating user data
class UserUpdate(BaseModel):
    email: Optional[str] = Field(None, max_length=100)
    sensor_id: Optional[str] = Field(None, max_length=50)
    bottle_weight: Optional[int] = None
    daily_goal: Optional[int] = None
    wakeup_time: Optional[time] = None
    sleep_time: Optional[time] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    gender: Optional[str] = Field(None, max_length=10)

# POST endpoint to update user details
@router.post("/update")
def update_user(update_user: UserUpdate, db: Session = Depends(get_db_session)):
    """Update user details based on input fields."""
    # Hardcoded for testing purposes, Supabase UUID can be used here in the future
    user_id = uuid.UUID('e6c23297-02e5-4ee5-a0a6-7f8f8c829c1c')  # Replace with real UUID

    update_data = {getattr(Users, key): value for key, value in update_user.dict(exclude_unset=True).items()}
    result = db.query(Users).filter(Users.id == user_id).update(update_data)

    if result == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.commit()
    
    updated_user = db.query(Users).filter(Users.id == user_id).first()
    
    return {"message": "User updated successfully", "user": updated_user}

# GET endpoint to retrieve user information
@router.get("/get")
def get_user_info(db: Session = Depends(get_db_session)):
    """Retrieve user information with specified fields."""
    # Hardcoded for testing purposes, Supabase UUID can be used here in the future
    user_id = uuid.UUID('c20ae46a-6d6d-4786-aac5-232b45142043')  # Replace with real UUID

    db_user = db.query(Users).filter(Users.supabase_user_id == user_id).first()

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Format the user data to return
    user_data = {
        "username": db_user.username,
        "sensor_id": db_user.sensor_id,
        "currect_water_level_in_bottle": db_user.currect_water_level_in_bottle,
        "bottle_weight": db_user.bottle_weight,
        "is_bottle_on_dock": db_user.is_bottle_on_dock,
        "daily_goal": db_user.daily_goal,
        "wakeup_time": db_user.wakeup_time,
        "sleep_time": db_user.sleep_time,
        "age": db_user.age,
        "weight": db_user.weight,
        "height": db_user.height,
        "gender": db_user.gender
    }
    
    return {"user": user_data}
