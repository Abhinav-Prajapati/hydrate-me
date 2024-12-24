from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    DateTime,
    Time,
    Float,
    ForeignKey,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid

Base = declarative_base()


class WaterIntake(Base):
    __tablename__ = "water_intake"
    __table_args__ = {"schema": "public"}

    # Columns
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    sensor_id = Column(String(50), nullable=True)
    water_intake_in_ml = Column(Integer, nullable=True)

    # Foreign key directly referencing 'id' in user_profile
    supabase_user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("public.user_profile.id", ondelete="CASCADE"),
        nullable=False,
    )

    # Relationship to Users
    user = relationship(
        "Users",
        back_populates="sensor_data",
    )


class Users(Base):
    __tablename__ = "user_profile"
    __table_args__ = {"schema": "public"}

    # Primary key directly referencing auth.users.id
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        nullable=False,
    )

    # Relationship to WaterIntake
    sensor_data = relationship(
        "WaterIntake",
        back_populates="user",
    )

    # User details
    username = Column(String(50), nullable=False)
    sensor_id = Column(String(50), unique=True, nullable=True)

    # Water-related details
    currect_water_level_in_bottle = Column(Integer, nullable=True)
    bottle_weight = Column(Integer, nullable=True)
    is_bottle_on_dock = Column(Boolean, nullable=True)
    daily_goal = Column(Integer, nullable=True)
    todays_water_intake_in_ml = Column(Integer, nullable=False, default=0)

    # Time details
    wakeup_time = Column(Time, nullable=True)
    sleep_time = Column(Time, nullable=True)

    # User profile attributes
    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    gender = Column(String(10), nullable=True)
