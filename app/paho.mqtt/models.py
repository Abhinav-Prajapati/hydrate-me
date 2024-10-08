from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from db import engine

Base = declarative_base()

class SensorData(Base):
    __tablename__ = 'sensor_data_1'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)  # Adding timestamp column
    sensor_id = Column(String(50), nullable=False)
    data = Column(String(255), nullable=False)

    # If you want separate date and time columns, you can do this:
    # date = Column(Date, default=datetime.utcnow().date)
    # time = Column(Time, default=datetime.utcnow().time)

# Create the tables if not exists
Base.metadata.create_all(bind=engine)