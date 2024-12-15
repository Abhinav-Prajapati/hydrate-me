from sqlalchemy import Boolean, Column, Integer, String, DateTime, Time, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.database.db import engine

Base = declarative_base()

class WaterIntake(Base):
    __tablename__ = 'water_intake'
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    sensor_id = Column(String(50), ForeignKey('user_profile.sensor_id'), nullable=True) 
    data = Column(String(255), nullable=True)

    # Foreign key to Users table
    user_id = Column(UUID(as_uuid=True), ForeignKey('user_profile.id', ondelete='CASCADE'), nullable=False)
    
    # Relationship to Users table, explicitly specifying the foreign key
    user = relationship("Users", back_populates="sensor_data", foreign_keys=[user_id])

class Users(Base):
    __tablename__ = 'user_profile'
    
    # Modify id to be UUID and add a reference to Supabase's auth.users
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    
    username = Column(String(50), nullable=False)
    sensor_id = Column(String(50), unique=True, nullable=True)  
    
    currect_water_level_in_bottle = Column(Integer, nullable=True)
    bottle_weight = Column(Integer, nullable=True)
    is_bottle_on_dock = Column(Boolean, nullable=True)
    daily_goal = Column(Integer, nullable=True)

    wakeup_time = Column(Time, nullable=True)
    sleep_time = Column(Time, nullable=True)
    
    age = Column(Integer, nullable=True)
    weight = Column(Float, nullable=True)
    height = Column(Float, nullable=True)
    gender = Column(String(10), nullable=True)
    
    # Relationship to WaterIntake table
    sensor_data = relationship("WaterIntake", back_populates="user", foreign_keys=[WaterIntake.user_id])

    # Adding a foreign key constraint to Supabase `auth.users` table
    # This assumes the `auth.users` table exists in Supabase schema and contains a UUID primary key
    supabase_user_id = Column(UUID(as_uuid=True), ForeignKey('auth.users.id', ondelete='CASCADE'), nullable=False)
 

# Create the tables if they do not exist
# Base.metadata.create_all(bind=engine)
