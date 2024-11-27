import pandas as pd
from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
uri = "mongodb+srv://admin_NJFloodNet:group34_CS546@njfloodnetcluster.1ua1x.mongodb.net/"
client = MongoClient(uri)
db = client["FinalProject"]
collection = db["Sensors"]

# Load the measurements from the Excel file
file_path = 'Sensor19.xlsx'  # Adjust the path if necessary
df = pd.read_excel(file_path)

# Print the column names to check for discrepancies
print("Columns in the Excel file:", df.columns)

# Prepare measurements for insertion (Assuming your Excel columns match the sensor measurement fields)
measurements = []
for index, row in df.iterrows():
    try:
        # Convert the 'Timestamp' field to string format if it's already a datetime object
        timestamp_str = row['Timestamp'].strftime("%d-%m-%Y-%H:%M:%S") if isinstance(row['Timestamp'], datetime) else \
        row['Timestamp']

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
        print(f"Column {e} not found in the row {index}")

# Find the sensor by sensor number or name
sensor_number = 19  # The sensor number you want to update
sensor = collection.find_one({"sensorNumber": sensor_number})

# Check if the sensor exists
if sensor:
    # Add the measurements to the existing sensor document
    collection.update_one(
        {"sensorNumber": sensor_number},
        {"$push": {"measurements": {"$each": measurements}}}
    )
    print(f"Successfully added {len(measurements)} measurements to Sensor {sensor_number}.")
else:
    print(f"Sensor with number {sensor_number} not found.")
