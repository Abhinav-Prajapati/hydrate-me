from loguru import logger
import paho.mqtt.client as mqtt
from app.database.db import get_db_session
from app.paho_mqtt.repositories.water_level_repository import WaterLevelRepository

# Function to handle the subscription event
def on_subscribe(client, userdata, mid, granted_qos, properties=None):
    try:
        logger.success(f"Subscribed successfully with QoS {granted_qos}")
    except Exception as e:
        logger.error(f"Failed to log subscription event: {e}")

# Function to handle incoming messages
def on_message(client, userdata, msg):
    try:
        # Log when a message is received
        message = msg.payload.decode()
        device_ID, current_weight = message.split("|")

        logger.info(f"Received raw weight (bottle weight included) `{round(float(current_weight),1)} gm` from device `{device_ID}`")

        # Add sensor data to the database
        with get_db_session() as session:
            repository = WaterLevelRepository(session)
            
            # Fetch the current bottle weight
            bottle_weight = repository.get_bottle_weight_by_sensor(device_ID)
            if bottle_weight is None:
                raise ValueError(f"Could not find bottle weight for device ID {device_ID}")

            # Calculate the weight difference and store it in the database
            weight_difference = float(current_weight) - bottle_weight
            repository.add_sensor_data(
                sensor_id=device_ID,
                data=round(weight_difference,2)
            )

        # Log success when data is written to the database
        logger.success(f"Data `{round(weight_difference,1)} gm` successfully written to the database for device {device_ID}")

    except ValueError as ve:
        logger.error(f"ValueError: {ve}")
    except Exception as e:
        # Log any exceptions that occur during message handling or database interaction
        logger.error(f"Failed to process/write to DB message `{msg.payload.decode()}` from topic `{msg.topic}`")
        logger.exception(f"Error occurred: {e}")

# Connect to the MQTT broker and continuously receive messages
def run_subscriber():
    try:
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

    except Exception as e:
        logger.error(f"Error in MQTT subscriber: {e}")
        raise

if __name__ == "__main__":
    run_subscriber()

