import paho.mqtt.client as mqtt

# Function to handle the subscription event
def on_subscribe(client, userdata, mid, granted_qos, properties=None):
    print(f"Subscribed successfully with QoS {granted_qos}")

# Function to handle incoming messages
def on_message(client, userdata, msg):
    print(f"Received `{msg.payload.decode()}` from topic `{msg.topic}`")

# Connect to the MQTT broker and continuously receive messages
def run_subscriber():
    broker = "localhost"
    port = 1883
    topic = "test_topic"
    
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
