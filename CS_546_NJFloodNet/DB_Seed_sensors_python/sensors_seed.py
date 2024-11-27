from pymongo import MongoClient
from bson import ObjectId

# Full list of sensors
sensor_coordinates = [
    {
        "sensorNumber": 12,
        "sensorName": "Sensor 12 @ Overbrook Park",
        "addedBy": ObjectId("507f1f77bcf86cd799439011"),
        "coords": "40.9948594604189° N, 74.02735098264648° W",
        "location": "Overbrook Park",
        "status": "Active",
        "measurements": [],
        "notes": [],
        "image": "./images/sensor12/overbrook_park.jpeg",
    },
    {
        "sensorNumber": 13,
        "sensorName": "Sensor 13 @ Brookside Park",
        "addedBy": ObjectId("507f1f77bcf86cd799439011"),
        "coords": "40.99852592064648° N, 74.03005456805411° W",
        "location": "Brookside Park",
        "status": "Active",
        "measurements": [],
        "notes": [],
        "image": "./images/sensor13/brookside_park.jpeg",
    },
    {
        "sensorNumber": 14,
        "sensorName": "Sensor 14 @ K-mart",
        "addedBy": ObjectId("507f1f77bcf86cd799439011"),
        "coords": "40.99641869891097° N, 74.0399895426159° W",
        "location": "K-mart",
        "status": "Active",
        "measurements": [],
        "notes": [],
        "image": "./images/sensor14/kmart.jpeg",
    },
    {
        "sensorNumber": 15,
        "sensorName": "Sensor 15 @ Richard Nugent Park",
        "addedBy": ObjectId("507f1f77bcf86cd799439011"),
        "coords": "40.99895153624935° N, 74.0402086386315° W",
        "location": "Richard Nugent Park",
        "status": "Active",
        "measurements": [],
        "notes": [],
        "image": "./images/sensor15/richard_nugent_park.jpeg",
    },
    {
        "sensorNumber": 18,
        "sensorName": "Sensor 18 @ Hillsdale Public Works Department",
        "addedBy": ObjectId("507f1f77bcf86cd799439011"),
        "coords": "40.99993328198413° N, 74.04005036459259° W",
        "location": "Hillsdale Public Works Department",
        "status": "Active",
        "measurements": [],
        "notes": [],
        "image": "./images/sensor18/hillsdale_public_works.jpeg",
    },
    {
        "sensorNumber": 16,
        "sensorName": "Sensor 16 @ Hoboken Terminal",
        "addedBy": ObjectId("507f1f77bcf86cd799439011"),
        "coords": "40.73584599585296° N, 74.02767888184088° W",
        "location": "Hoboken Terminal",
        "status": "Active",
        "measurements": [],
        "notes": [],
        "image": "./images/sensor16/hoboken_terminal.jpeg",
    },
    {
        "sensorNumber": 19,
        "sensorName": "Sensor 19 @ Finnegan's Hoboken",
        "addedBy": ObjectId("507f1f77bcf86cd799439011"),
        "coords": "40.746555657779005° N, 74.03198526745322° W",
        "location": "Finnegan's Hoboken",
        "status": "Active",
        "measurements": [],
        "notes": [],
        "image": "./images/sensor19/Finnegan.jpeg",
    },
    {
        "sensorNumber": 17,
        "sensorName": "Sensor 17 @ Davidson Lab",
        "addedBy": ObjectId("507f1f77bcf86cd799439011"),
        "coords": "40.74447226722596° N, 74.02729028141329° W",
        "location": "Davidson Lab",
        "status": "Active",
        "measurements": [],
        "notes": [],
        "image": "./images/sensor17/davidson_lab.jpeg",
    },
]

# Connect to MongoDB Atlas
uri = "mongodb+srv://admin_NJFloodNet:group34_CS546@njfloodnetcluster.1ua1x.mongodb.net/"
client = MongoClient(uri)
db = client["FinalProject"]
collection = db["Sensors"]

# Insert sensors
for sensor in sensor_coordinates:
    existing_sensor = collection.find_one({"sensorNumber": sensor["sensorNumber"]})
    if not existing_sensor:
        result = collection.insert_one(sensor)
        print(f"Inserted sensor: {sensor['sensorName']} with _id: {result.inserted_id}")
    else:
        print(f"Sensor with sensorNumber {sensor['sensorNumber']} already exists.")

client.close()
