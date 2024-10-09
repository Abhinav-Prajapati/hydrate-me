from sqlalchemy import Column, Integer, String, DateTime, Time
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy.orm import relationship

from app.database.db import engine

Base = declarative_base()

class SensorData(Base):
    __tablename__ = 'sensor_data_1'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)  
    sensor_id = Column(String(50), nullable=True)
    data = Column(String(255), nullable=True)

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    sensor_id = Column(String(50), nullable=False) 

    daily_goal = Column(Integer, nullable=True)
    wakeup_time = Column(Time, nullable=True)
    sleep_time = Column(Time, nullable=True) 
    bottle_weight = Column(Integer, nullable=True) 

# Create the tables if not exists
Base.metadata.create_all(bind=engine)