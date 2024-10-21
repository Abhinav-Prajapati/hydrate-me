from typing import List, Optional, Dict
from sqlalchemy import Float
from sqlalchemy.orm import sessionmaker, Session
from fastapi import HTTPException, Depends, APIRouter
from pydantic import BaseModel

from app.database.db import engine
from app.server.User.service.user_service import UserService

# Set up a sessionmaker
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create an APIRouter to manage all routes
router = APIRouter()

# Pydantic Models for Response
class UserInfo(BaseModel):
    id: int
    name: str
    sensor_id: str
    daily_goal: Optional[int] = None
    wakeup_time: Optional[str] = None
    sleep_time: Optional[str] = None
    bottle_weight: Optional[int] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    gender: Optional[str] = None
    currect_water_level_in_bottle: Optional[int] = None  
    is_bottle_on_dock: Optional[bool] = None  

class WaterIntake(BaseModel):
    timestamp: str
    data: float

# Group all API endpoints under /api/v1 prefix
@router.get("/api/v1/user/{user_id}", response_model=UserInfo)
async def get_user_info(user_id: int, db: Session = Depends(get_db)):
    """
    Fetches and returns user information for the given user ID.
    """
    user_service = UserService(db, user_id=user_id)
    user_info = user_service.get_user_info()

    if "error" in user_info:
        raise HTTPException(status_code=404, detail="User not found")

    return user_info


### Water Intake Related APIs ###
@router.get("/api/v1/user/{user_id}/today-water-intake", response_model=List[WaterIntake])
async def get_today_water_intake(user_id: int, db: Session = Depends(get_db)):
    """
    Fetches today's water intake data for the given user ID.
    """
    user_service = UserService(db, user_id=user_id)
    today_water_intake = user_service.get_today_water_intake()

    if not today_water_intake:
        raise HTTPException(status_code=404, detail="No water intake data for today")
    
    # Return list of water intake records in JSON
    return [{"timestamp": t, "data": d} for t, d in today_water_intake]


@router.get("/api/v1/user/{user_id}/week-water-intake", response_model=List[WaterIntake])
async def get_week_water_intake(user_id: int, db: Session = Depends(get_db)):
    """
    Fetches this week's water intake data for the given user ID.
    """
    user_service = UserService(db, user_id=user_id)
    week_water_intake = user_service.get_week_water_intake()

    if not week_water_intake:
        raise HTTPException(status_code=404, detail="No water intake data for this week")
    
    # Return list of weekly water intake records in JSON
    return [{"timestamp": t, "data": d} for t, d in week_water_intake]


@router.get("/api/v1/user/{user_id}/total-water-intake", response_model=Dict[str, float])
async def get_total_water_intake_today(user_id: int, db: Session = Depends(get_db)):
    """
    Fetches the total water intake for today for the given user ID.
    """
    user_service = UserService(db, user_id=user_id)
    total_water_intake_today = user_service.get_todays_total_water_intake()

    # Return the total water intake for today in JSON
    return {"total_water_intake": total_water_intake_today}


### User Info Update APIs ###

@router.put("/api/v1/user/{user_id}/set-daily-goal", response_model=Dict[str, str])
async def set_daily_goal(user_id: int, new_daily_goal: int, db: Session = Depends(get_db)):
    """
    Updates the user's daily water intake goal.
    """
    user_service = UserService(db, user_id=user_id)
    result = user_service.set_daily_goal(new_daily_goal)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result)

    # Return success message in JSON
    return {"message": result}


@router.put("/api/v1/user/{user_id}/set-wakeup-time", response_model=Dict[str, str])
async def set_wakeup_time(user_id: int, new_wakeup_time: str, db: Session = Depends(get_db)):
    """
    Updates the user's wakeup time.
    """
    user_service = UserService(db, user_id=user_id)
    result = user_service.set_wakeup_time(new_wakeup_time)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result)

    # Return success message in JSON
    return {"message": result}


@router.put("/api/v1/user/{user_id}/set-sleep-time", response_model=Dict[str, str])
async def set_sleep_time(user_id: int, new_sleep_time: str, db: Session = Depends(get_db)):
    """
    Updates the user's sleep time.
    """
    user_service = UserService(db, user_id=user_id)
    result = user_service.set_sleep_time(new_sleep_time)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result)

    # Return success message in JSON
    return {"message": result}


@router.put("/api/v1/user/{user_id}/set-weight", response_model=Dict[str, str])
async def set_weight(user_id: int, new_weight: float, db: Session = Depends(get_db)):
    """
    Updates the user's weight.
    """
    user_service = UserService(db, user_id=user_id)
    result = user_service.set_weight(new_weight)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result)

    # Return success message in JSON
    return {"message": result}


@router.put("/api/v1/user/{user_id}/set-bottle-weight", response_model=Dict[str, str])
async def set_bottle_weight(user_id: int, new_bottle_weight: int, db: Session = Depends(get_db)):
    """
    Updates the user's bottle weight.
    """
    user_service = UserService(db, user_id=user_id)
    result = user_service.set_bottle_weight(new_bottle_weight)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result)

    # Return success message in JSON
    return {"message": result}


@router.put("/api/v1/user/{user_id}/set-sensor-id", response_model=Dict[str, str])
async def set_sensor_id(user_id: int, new_sensor_id: str, db: Session = Depends(get_db)):
    """
    Updates the user's sensor ID.
    """
    user_service = UserService(db, user_id=user_id)
    result = user_service.set_sensor_id(new_sensor_id)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result)

    # Return success message in JSON
    return {"message": result}

@router.get("/api/v1/user/{user_id}/bottle-weight", response_model=Dict[str, Optional[int]])
async def get_bottle_weight(user_id: int, db: Session = Depends(get_db)):
    """
    Fetches the user's bottle weight.
    """
    user_service = UserService(db, user_id=user_id)
    bottle_weight = user_service.get_bottle_weight()

    if bottle_weight is None:
        raise HTTPException(status_code=404, detail="Bottle weight not found")

    return {"bottle_weight": bottle_weight}

@router.get("/api/v1/user/{user_id}/sleep-time", response_model=Dict[str, Optional[str]])
async def get_sleep_time(user_id: int, db: Session = Depends(get_db)):
    """
    Fetches the user's sleep time.
    """
    user_service = UserService(db, user_id=user_id)
    sleep_time = user_service.get_sleep_time()

    if sleep_time is None:
        raise HTTPException(status_code=404, detail="Sleep time not found")

    return {"sleep_time": sleep_time}

@router.get("/api/v1/user/{user_id}/wakeup-time", response_model=Dict[str, Optional[str]])
async def get_wakeup_time(user_id: int, db: Session = Depends(get_db)):
    """
    Fetches the user's wakeup time.
    """
    user_service = UserService(db, user_id=user_id)
    wakeup_time = user_service.get_wakeup_time()

    if wakeup_time is None:
        raise HTTPException(status_code=404, detail="Wakeup time not found")

    return {"wakeup_time": wakeup_time}

@router.get("/api/v1/user/{user_id}/daily-goal", response_model=Dict[str, Optional[int]])
async def get_daily_goal(user_id: int, db: Session = Depends(get_db)):
    """
    Fetches the user's daily water intake goal.
    """
    user_service = UserService(db, user_id=user_id)
    daily_goal = user_service.get_daily_goal()

    if daily_goal is None:
        raise HTTPException(status_code=404, detail="Daily goal not found")

    return {"daily_goal": daily_goal}

@router.get("/api/v1/user/{user_id}/current-water-level", response_model=Dict[str, Optional[int]])
async def get_current_water_level(user_id: int, db: Session = Depends(get_db)):
    """
    Fetches the current water level in the user's bottle.
    """
    user_service = UserService(db, user_id=user_id)
    current_level = user_service.get_current_bottle_water_level()

    if current_level is None:
        raise HTTPException(status_code=404, detail="Current water level not found")

    return {"current_water_level": int(float(current_level))}


@router.get("/api/v1/user/{user_id}/is-bottle-on-dock", response_model=Dict[str, Optional[bool]])
async def get_is_bottle_on_dock(user_id: int, db: Session = Depends(get_db)):
    """
    Fetches the status of whether the bottle is placed on the dock.
    """
    user_service = UserService(db, user_id=user_id)
    is_on_dock = user_service.get_is_bottle_placed_on_dock()

    if is_on_dock is None:
        raise HTTPException(status_code=404, detail="Bottle dock status not found")

    return {"is_bottle_on_dock": is_on_dock}


@router.put("/api/v1/user/{user_id}/current-water-level", response_model=Dict[str, str])
async def set_current_water_level(user_id: int, current_level: int, db: Session = Depends(get_db)):
    """
    Updates the current water level in the user's bottle.
    """
    user_service = UserService(db, user_id=user_id)
    result = user_service.set_current_bottle_water_level(current_level)

    if not result:
        raise HTTPException(status_code=400, detail="Failed to update current water level")

    return {"message": "Current water level updated successfully"}

@router.put("/api/v1/user/{user_id}/is-bottle-on-dock", response_model=Dict[str, str])
async def set_is_bottle_on_dock(user_id: int, is_on_dock: bool, db: Session = Depends(get_db)):
    """
    Updates the status of whether the bottle is placed on the dock.
    """
    user_service = UserService(db, user_id=user_id)
    result = user_service.set_is_bottle_placed_on_dock(is_on_dock)

    if not result:
        raise HTTPException(status_code=400, detail="Failed to update bottle dock status")

    return {"message": "Bottle dock status updated successfully"}
