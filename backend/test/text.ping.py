import paho.mqtt.client as mqtt

DEVICE_ID = "esp32_1" 
PING_TOPIC = f"{DEVICE_ID}/ping"
PONG_TOPIC = f"{DEVICE_ID}/pong"

MQTT_BROKER_URL = "localhost"
MQTT_BROKER_PORT = 1883

# Initialize MQTT client
client = mqtt.Client()

# Define the callback for receiving messages
def on_message(client, userdata, msg):
    if msg.topic == PING_TOPIC and msg.payload.decode() == "1":
        print(f"Ping received on topic '{PING_TOPIC}', sending pong response...")
        client.publish(PONG_TOPIC, "2")  # Respond with a "pong" message
    else:
        print(f"Received unexpected message on topic '{msg.topic}': {msg.payload.decode()}")

# Connect to MQTT broker and subscribe to the ping topic
client.on_message = on_message
client.connect(MQTT_BROKER_URL, MQTT_BROKER_PORT)
client.subscribe(PING_TOPIC)

# Start the client loop to listen for messages
client.loop_start()

print(f"Listening for ping messages on topic '{PING_TOPIC}'...")

try:
    # Keep the script running
    while True:
        pass
except KeyboardInterrupt:
    print("Test script stopped.")
finally:
    client.loop_stop()
    client.disconnect()
