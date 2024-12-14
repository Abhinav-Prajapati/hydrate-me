from app.auth.get_user import get_current_user
from app.database.db import get_db_session
from app.database.models import Users

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import time

router = APIRouter()

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
   
@router.post("/update")
def update_user(update_user: UserUpdate, db: Session = Depends(get_db_session), user=Depends(get_current_user)):
    """Update user details based on input fields."""
    username = user.username
    update_data = {getattr(Users, key): value for key, value in update_user.dict(exclude_unset=True).items()}
    result = db.query(Users).filter(Users.username == username).update(update_data)
    if result == 0:
        raise HTTPException(status_code=404, detail="User not found")
    db.commit()
    updated_user = db.query(Users).filter(Users.username == username).first()
    return {"message": "User updated successfully", "user": updated_user}

@router.get("/get")
def get_user_info(user=Depends(get_current_user), db: Session = Depends(get_db_session)):
    """Retrieve user information with specified fields."""
    db_user = db.query(Users).filter(Users.username == user.username).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user_data = {
        "username": db_user.username,
        "email": db_user.email,
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
