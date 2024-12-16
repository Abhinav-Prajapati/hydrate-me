from app.users.user_service import get_user_water_data, retrieve_user_data
from app.database.db import get_db_session
from app.utils.validate_jwt import validate_jwt
from app.users.user_service import add_consumption_for_user

from fastapi import APIRouter, Depends, responses
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


@router.post("/add_intake")
def add_water_intake(
    db: Session = Depends(get_db_session),
    user_uuid: str = Depends(validate_jwt),
    sensor_id: str = "",
    intake: int = 0,
):
    """
    Add water intake data for the user.
    """
    response = add_consumption_for_user(
        db,
        user_uuid,
        sensor_id,
        intake,
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
