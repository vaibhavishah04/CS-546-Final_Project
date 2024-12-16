import pandas as pd
from pymongo import MongoClient
from datetime import datetime
import os

# Connect to MongoDB
uri = "mongodb+srv://admin_NJFloodNet:group34_CS546@njfloodnetcluster.1ua1x.mongodb.net/"
client = MongoClient(uri)
db = client["FinalProject"]
collection = db["Sensors"]

# Base file path for sensors (adjust as needed)
base_path = "./"  # Directory containing Sensor Excel files

# List of sensor numbers and corresponding file names
sensor_numbers = list(range(12, 20))  # Sensor12 to Sensor19

# Iterate over each sensor file and process its data
for sensor_number in sensor_numbers:
    file_path = os.path.join(base_path, f"Sensor{sensor_number}.xlsx")

    # Check if the file exists
    if not os.path.exists(file_path):
        print(f"File for Sensor {sensor_number} not found: {file_path}")
        continue

    print(f"Processing Sensor {sensor_number}...")

    # Load the measurements from the Excel file
    df = pd.read_excel(file_path)

    # Print column names for debugging
    print(f"Columns in Sensor {sensor_number} file: {df.columns}")

    # Limit the number of rows to 1000
    df = df.head(1000)

    # Prepare measurements for insertion
    measurements = []
    for index, row in df.iterrows():
        try:
            # Convert the 'Timestamp' field to string format if necessary
            timestamp_str = row['Timestamp'].strftime("%d-%m-%Y-%H:%M:%S") if isinstance(row['Timestamp'],
                                                                                         datetime) else row['Timestamp']

            measurement = {
                "timestamp": timestamp_str,
                "errorCode": row['Error Code'],
                "voltage": row['Voltage'],
                "distanceMm": row['Distance (mm)'],
                "eventAccMm": row['Event Acc (mm)'],
                "rainAccMm": row['Rain Acc (mm)'],
                "totalAccMm": row['Total Acc (mm)'],
                "rainIntensity": row['Rain Int (mmph)']
            }
            measurements.append(measurement)
        except KeyError as e:
            print(f"Column {e} not found in row {index} for Sensor {sensor_number}")

    # Find the sensor document in MongoDB
    sensor = collection.find_one({"sensorNumber": sensor_number})

    if sensor:
        # Add the measurements to the existing sensor document
        collection.update_one(
            {"sensorNumber": sensor_number},
            {"$push": {"measurements": {"$each": measurements}}}
        )
        print(f"Successfully added {len(measurements)} measurements to Sensor {sensor_number}.")
    else:
        print(f"Sensor with number {sensor_number} not found in the database.")

print("Data seeding completed.")
