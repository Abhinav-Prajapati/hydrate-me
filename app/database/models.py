from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from sqlalchemy.orm import relationship

from app.database.db import engine

Base = declarative_base()

class SensorData(Base):
    __tablename__ = 'sensor_data_1'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)  
    sensor_id = Column(String(50), nullable=False)
    data = Column(String(255), nullable=False)

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    sensor_id = Column(String(50), nullable=False) 

# Create the tables if not exists
Base.metadata.create_all(bind=engine)