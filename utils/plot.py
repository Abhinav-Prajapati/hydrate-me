import pandas as pd
import matplotlib.pyplot as plt

# Read CSV file
df = pd.read_csv('weight_data.csv')

# Convert the timestamp to datetime for better plotting
df['timestamp'] = pd.to_datetime(df['timestamp'])

# Plotting the data
plt.figure(figsize=(10, 5))
plt.plot(df['timestamp'], df['weight'], marker='o', linestyle='-')

# Set plot labels and title
plt.xlabel('Timestamp')
plt.ylabel('Weight (grams)')
plt.title('Weight Measurements Over Time')
plt.xticks(rotation=45)
plt.grid(True)
plt.tight_layout()

# Show the plot
plt.show()

