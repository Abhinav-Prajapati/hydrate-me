from sqlalchemy import Boolean, Column, Integer, String, DateTime, Time, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.db import engine

Base = declarative_base()

class SensorData(Base):
    __tablename__ = 'sensor_data'
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    sensor_id = Column(String(50), ForeignKey('users.sensor_id'), nullable=True) 
    data = Column(String(255), nullable=True)

    # Relationship to Users
    user = relationship("Users", back_populates="sensor_data")

class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    
    username = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
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
    
    sensor_data = relationship("SensorData", back_populates="user")

# Create the tables if they do not exist
Base.metadata.create_all(bind=engine)
