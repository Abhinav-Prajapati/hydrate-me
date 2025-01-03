from datetime import datetime

import uuid
from pydantic import BaseModel
from app.users.user_repo import update_user_profile
from app.users.user_service import (
    get_user_profile_service,
    get_user_water_data,
    retrieve_user_data,
)
from app.database.db import get_db_session
from app.utils.validate_jwt import validate_jwt
from app.users.user_service import add_consumption_for_user

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/get")
def get_user_info(
    db: Session = Depends(get_db_session),
    user_uuid: str = Depends(validate_jwt),
):
    """Retrieve user information."""
    user_data = retrieve_user_data(db, user_uuid)
    return user_data


class WaterIntakeRequest(BaseModel):
    sensor_id: str = ""
    intake: int = 0
    time: datetime


@router.post("/add_intake")
def add_water_intake(
    db: Session = Depends(get_db_session),
    user_uuid: str = Depends(validate_jwt),
    intake_data: WaterIntakeRequest = Depends(),
):
    """
    Add water intake data for the user.
    """
    response = add_consumption_for_user(
        db,
        user_uuid,
        intake_data.sensor_id,
        intake_data.intake,
        intake_data.time,
    )
    return response


@router.get("/get_user_water_attributes")
def get_user_water_attributes(
    db: Session = Depends(get_db_session),
    user_uuid: str = Depends(validate_jwt),
):
    """get user water related details"""
    response = get_user_water_data(db, user_uuid)
    return response


@router.get("/get_user_profile")
def get_user_profile(
    db: Session = Depends(get_db_session),
    user_uuid: str = Depends(validate_jwt),
):
    """get user water related details"""
    response = get_user_profile_service(db, user_uuid)
    return response


@router.post("/set_daily_goal")
def set_daily_goal(
    db: Session = Depends(get_db_session),
    user_uuid: str = Depends(validate_jwt),
    dailyGoal: int = 0,
):
    """update daily goal of user"""
    user_UUID = uuid.UUID(user_uuid)
    response = update_user_profile(db, user_UUID, daily_goal=dailyGoal)
    return response
