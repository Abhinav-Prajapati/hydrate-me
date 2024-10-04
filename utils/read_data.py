import serial
import time
import pandas as pd

# Configure serial port
SERIAL_PORT = '/dev/ttyUSB0'  # Replace with your actual serial port
BAUD_RATE = 115200            # Same baud rate as set in the ESP8266 code

# Open the serial connection
ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)

# Create an empty list to store data
data = []

try:
    while True:
        # Read a line from the serial port
        line = ser.readline().decode('utf-8').strip()
        
        if line:
            # Get the current timestamp and weight
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
            weight = line.replace(" grams", "")

            # Store the timestamp and weight in the data list
            data.append({"timestamp": timestamp, "weight": float(weight)})

            # Print the data to the console
            print(f"Timestamp: {timestamp}, Weight: {weight} grams")

            # Save data to CSV every 10 readings
            if len(data) % 10 == 0:
                df = pd.DataFrame(data)
                df.to_csv("weight_data.csv", index=False)

except KeyboardInterrupt:
    # Close the serial connection on exit
    ser.close()
    print("\nSerial connection closed.")

