from loguru import logger
import paho.mqtt.client as mqtt
from db import get_db_session
from repositories.water_level_repository import WaterLevelRepository

# Function to handle the subscription event
def on_subscribe(client, userdata, mid, granted_qos, properties=None):
    logger.info(f"Subscribed successfully with QoS {granted_qos}")

# Function to handle incoming messages
def on_message(client, userdata, msg):
    try:
        # Log when a message is received
        message = msg.payload.decode()
        device_ID, current_weight = message.split("|")

        logger.info(f"Received `{current_weight}` from device `{device_ID}`")

        # Add sensor data to the database
        with get_db_session() as session:
            repository = WaterLevelRepository(session)
            repository.add_sensor_data(
                sensor_id=device_ID,
                data=current_weight
            )

        # Log success when data is written to the database
        logger.success(f"Data `{current_weight}` successfully written to the database for device {device_ID}")

    except Exception as e:
        # Log any exceptions that occur during message handling or database interaction
        logger.error(f"Failed to process/writetodb message `{msg.payload.decode()}` from topic `{msg.topic}`")
        logger.exception(f"Error occurred: {e}")

# Connect to the MQTT broker and continuously receive messages
def run_subscriber():
    broker = "localhost"
    port = 1883
    topic = "/weight_change"
    
    # Create MQTT client instance
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

    # Set callbacks for subscription and message handling
    client.on_subscribe = on_subscribe
    client.on_message = on_message

    # Connect to the broker
    client.connect(broker, port)
    
    # Subscribe to the topic
    client.subscribe(topic, qos=1) 

    # Start the network loop to process incoming messages
    client.loop_forever()

if __name__ == "__main__":
    run_subscriber()
