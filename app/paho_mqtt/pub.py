import time
import random
import paho.mqtt.client as mqtt

# Function to handle the publish event callback
def on_publish(client, userdata, mid,reason_code, properties):
    print(f"Message ID {mid} published successfully.")

# Connect to the MQTT broker and continuously publish messages
def run_publisher():
    broker = "localhost"
    port = 1883
    topic = "/esp32-n2vf7inz/led_mode"
    
    # Create MQTT client instance
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

    # Set callback for publishing messages
    client.on_publish = on_publish
    
    # Connect to the broker
    client.connect(broker, port)
    
    # Start the network loop in a non-blocking way
    client.loop_start()

    try:
        msg_count = 1
        # Continuously publish messages every 1 second
        while True:
            message = f"{3}"
            result = client.publish(topic, message, qos=1)
            result.wait_for_publish()  # Ensure the message is published
            print(f"Published: {message}")
            msg_count += 1
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopping publisher...")
    finally:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    run_publisher()
