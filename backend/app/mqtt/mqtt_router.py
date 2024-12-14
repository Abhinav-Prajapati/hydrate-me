# mqtt_router.py

from app.auth.get_user import get_db_session
from app.auth.router import get_current_user

from app.database.models import Users, SensorData
from fastapi import APIRouter, Depends, HTTPException, responses
from app.mqtt.mqtt_handler import publish_message
from sqlalchemy.orm import Session

router = APIRouter()

# FastAPI route to publish LED mode to the /ledmode topic
@router.post("/set_led_mode")
async def set_led_mode(led_mode: str, user = Depends(get_current_user), db: Session = Depends(get_db_session)):
    """
    FastAPI route to set the LED mode by publishing to the /ledmode topic.
    """
    # get user name from jwt token 
    username = user.username 

    db_user = db.query(Users).filter(Users.username == username).first()

    if db_user is None:
        raise ValueError("user not found")

    DEVICE_ID = db_user.sensor_id
    
    topic_publish = f"{DEVICE_ID}/ledmode"
    # TODO: add proper error response msg when data is not published
    publish_message(topic_publish, led_mode)
    return {"status": "success", "message": f"LED mode set to `{led_mode}` on topic `{topic_publish}` "}

