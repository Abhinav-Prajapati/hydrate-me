import paho.mqtt.client as mqtt
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.mqtt.config import MQTT_BROKER_URL, MQTT_BROKER_PORT, MQTT_BROKER_USER_PASSWORD, MQTT_BROKER_USER

mqtt_client = mqtt.Client()
mqtt_client.username_pw_set(MQTT_BROKER_USER,MQTT_BROKER_USER_PASSWORD)

def __write_to_db(device_id: str, weight: float, db: Session):
    """
    Writes the received MQTT data to the database.
    """
    from app.database.models import SensorData
    sensor_data = SensorData(sensor_id=device_id, data=weight)
    db.add(sensor_data)
    db.commit()

def __on_message(client, userdata, msg):
    """
    Callback function to handle incoming MQTT messages.
    """
    message = msg.payload.decode()
    try:
        device_id, data_type, value = message.split("|")
        if data_type == "weight":
            weight = float(value)
            print(f"Received weight `{weight}` for device `{device_id}` on topic `{msg.topic}`") # Write to the database using a session from get_db
            with get_db() as session:
                __write_to_db(device_id, weight, session)
            print(f"Data written to database for device `{device_id}`")
        else:
            print(f"Unknown data type `{data_type}`")
    
    except ValueError as ve:
        print(f"ValueError while processing message: {ve}")
    except Exception as e:
        print(f"Error processing message `{message}`: {e}")

def run_mqtt_client():
    """
    Initializes the MQTT client, connects to the broker, and subscribes to topics.
    """
    broker = MQTT_BROKER_URL
    port = MQTT_BROKER_PORT
    topic_subscribe = "/weight_change"

    mqtt_client.on_message = __on_message

    mqtt_client.connect(broker, port)

    mqtt_client.subscribe(topic_subscribe, qos=1)

    mqtt_client.loop_start()

def publish_message(topic: str, message: str):
    """
    Publishes a message to a specific topic using QoS 1.
    """
    mqtt_client.publish(topic, message, qos=1)

'''
In MQTT, QoS 2 guarantees that each message is delivered exactly once. 
This is critical for cases where message duplication must be avoided, 
such as when sending sensor data or other important updates. By using 
QoS 2 in receive_data_once, we ensure the MQTT broker will keep trying 
to deliver the message until it is confirmed by the client, which is 
ideal for applications that require high data reliability.

More details: https://www.hivemq.com/blog/mqtt-essentials-part-6-mqtt-quality-of-service-levels/
'''
