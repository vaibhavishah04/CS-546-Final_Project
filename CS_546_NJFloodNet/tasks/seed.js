import { MongoClient, ObjectId } from "mongodb";
import xlsx from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// MongoDB connection URI
const uri = "mongodb+srv://admin_NJFloodNet:group34_CS546@njfloodnetcluster.1ua1x.mongodb.net/";
const dbName = "FinalProject";
const collectionName = "Sensors";

// Sensor metadata for all sensors
const sensorCoordinates = [
  {
    sensorNumber: 12,
    sensorName: "Sensor 12 @ Overbrook Park",
    addedBy: new ObjectId("507f1f77bcf86cd799439011"),
    coords: "40.9948594604189° N, 74.02735098264648° W",
    location: "Overbrook Park",
    status: "Active",
    measurements: [],
    notes: [],
    image: "./images/sensor12/overbrook_park.jpeg",
  },
  {
    sensorNumber: 13,
    sensorName: "Sensor 13 @ Brookside Park",
    addedBy: new ObjectId("507f1f77bcf86cd799439011"),
    coords: "40.99852592064648° N, 74.03005456805411° W",
    location: "Brookside Park",
    status: "Active",
    measurements: [],
    notes: [],
    image: "./images/sensor13/brookside_park.jpeg",
  },
  {
    sensorNumber: 14,
    sensorName: "Sensor 14 @ K-mart",
    addedBy: new ObjectId("507f1f77bcf86cd799439011"),
    coords: "40.99641869891097° N, 74.0399895426159° W",
    location: "K-mart",
    status: "Active",
    measurements: [],
    notes: [],
    image: "./images/sensor14/kmart.jpeg",
  },
  {
    sensorNumber: 15,
    sensorName: "Sensor 15 @ Richard Nugent Park",
    addedBy: new ObjectId("507f1f77bcf86cd799439011"),
    coords: "40.99895153624935° N, 74.0402086386315° W",
    location: "Richard Nugent Park",
    status: "Active",
    measurements: [],
    notes: [],
    image: "./images/sensor15/richard_nugent_park.jpeg",
  },
  {
    sensorNumber: 16,
    sensorName: "Sensor 16 @ Hoboken Terminal",
    addedBy: new ObjectId("507f1f77bcf86cd799439011"),
    coords: "40.73584599585296° N, 74.02767888184088° W",
    location: "Hoboken Terminal",
    status: "Active",
    measurements: [],
    notes: [],
    image: "./images/sensor16/hoboken_terminal.jpeg",
  },
  {
    sensorNumber: 17,
    sensorName: "Sensor 17 @ Davidson Lab",
    addedBy: new ObjectId("507f1f77bcf86cd799439011"),
    coords: "40.74447226722596° N, 74.02729028141329° W",
    location: "Davidson Lab",
    status: "Active",
    measurements: [],
    notes: [],
    image: "./images/sensor17/davidson_lab.jpeg",
  },
  {
    sensorNumber: 18,
    sensorName: "Sensor 18 @ Hillsdale Public Works Department",
    addedBy: new ObjectId("507f1f77bcf86cd799439011"),
    coords: "40.99993328198413° N, 74.04005036459259° W",
    location: "Hillsdale Public Works Department",
    status: "Active",
    measurements: [],
    notes: [],
    image: "./images/sensor18/hillsdale_public_works.jpeg",
  },
  {
    sensorNumber: 19,
    sensorName: "Sensor 19 @ Finnegan's Hoboken",
    addedBy: new ObjectId("507f1f77bcf86cd799439011"),
    coords: "40.746555657779005° N, 74.03198526745322° W",
    location: "Finnegan's Hoboken",
    status: "Active",
    measurements: [],
    notes: [],
    image: "./images/sensor19/Finnegan.jpeg",
  },
];

// Resolve the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
const seedSensors = async () => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert metadata if sensors don't exist
    for (const sensor of sensorCoordinates) {
      const exists = await collection.findOne({ sensorNumber: sensor.sensorNumber });
      if (!exists) {
        const result = await collection.insertOne(sensor);
        console.log(`Inserted sensor: ${sensor.sensorName} with ID: ${result.insertedId}`);
      } else {
        console.log(`Sensor ${sensor.sensorNumber} already exists.`);
      }
    }

    // Process Excel files for measurements
    for (const sensor of sensorCoordinates) {
      const filePath = path.join(__dirname, `Sensor${sensor.sensorNumber}.xlsx`);

      if (!fs.existsSync(filePath)) {
        console.warn(`File not found for Sensor ${sensor.sensorNumber}: ${filePath}`);
        continue;
      }

      console.log(`Processing measurements for Sensor ${sensor.sensorNumber}...`);

      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Limit to 1000 rows
      const measurements = data.slice(0, 1000).map((row) => ({
        timestamp: (() => {
          const dateValue = row["Timestamp"];
          const parsedDate = new Date(dateValue);
        
          // Handle the MM/DD/YYYY format manually if parsing fails
          if (isNaN(parsedDate)) {
            const [datePart, timePart] = dateValue.split(" ");
            const [month, day, year] = datePart.split("/").map(Number);
            const [hour, minute] = timePart.split(":").map(Number);
        
            const correctedDate = new Date(year, month - 1, day, hour, minute);
            return !isNaN(correctedDate) ? correctedDate.toISOString() : "Invalid Date";
          }
        
          return parsedDate.toISOString();
        })(),
        errorCode: row["Error Code"],
        voltage: row["Voltage"],
        distanceMm: row["Distance (mm)"],
        eventAccMm: row["Event Acc (mm)"],
        rainAccMm: row["Rain Acc (mm)"],
        totalAccMm: row["Total Acc (mm)"],
        rainIntensity: row["Rain Int (mmph)"],
      }));

      await collection.updateOne(
        { sensorNumber: sensor.sensorNumber },
        { $push: { measurements: { $each: measurements } } }
      );

      console.log(`Added ${measurements.length} measurements to Sensor ${sensor.sensorNumber}`);
    }

    console.log("All sensors and measurements seeded successfully!");
  } catch (err) {
    console.error("Error seeding sensors:", err.message);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
};

// Run the script
seedSensors();
