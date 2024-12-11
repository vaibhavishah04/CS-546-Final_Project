/**
 * Manage CRUD operations for sensors and their data.
 */

import { sensors } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb"
import sensorVal from "../validation/sensor_val.js"


// Add a new sensor to the database
const addSensor = async (sensorNumber, sensorName, addedBy, coords, location, image) => {
    if (typeof sensorData !== "object" || Array.isArray(sensorData)) throw new Error("Invalid sensor data.");
    if (!(sensorVal.valid_sensor_number(sensorNumber))) throw new Error("Invalid sensor number.");
    if (!(sensorVal.valid_string(sensorName))) throw new Error("Invalid sensor name.");
    if (!(sensorVal.valid_obj_id(addedBy))) throw new Error("Invalid addedBy ID.");
    if (!(sensorVal.valid_coordinates(coords))) throw new Error("Invalid coordinates.");
    if (!(sensorVal.valid_string(location))) throw new Error("Invalid location.");
    if (!(sensorVal.valid_impath(image))) throw new Error("Invalid image path.");

    const sensorCollection = await sensors();
    measurements = [];
    notes = [];
    try {
        sensorCollection.insertOne({ 
            "sensorNumber": sensorNumber, 
            "sensorName": sensorName, 
            "addedBy": ObjectId.createFromHexString(addedBy), 
            "coords": coords, 
            "location": location, 
            "image": image, 
            "measurements": measurements, 
            "notes": notes
        })
        return getSensorByIdOrName(sensorNumber)
    } catch (e) { 
        throw new Error("Error adding sensor to the database.")
    }
}

// Retrieve all sensors
const getAllSensors = async () => {
    const sensorCollection = await sensors();
    try {
        return await sensorCollection.find({}).toArray()
     } catch (e) {
        throw new Error("Error retrieving sensors from the database.")
    }
}

// Retrieve sensor details by ID, name, or number
const getSensorByIdOrName = async (identifier, options={}) => {
    const sensorCollection = await sensors();
    try {
        if (sensorVal.valid_obj_id(identifier)) {
            const sensor = await sensorCollection.findOne({ _id: ObjectId.createFromHexString(identifier) }, options);
            if (!sensor) throw new Error("Sensor not found.");
            return sensor
        } else if (sensorVal.valid_sensor_number(identifier)) {
            const sensor = await sensorCollection.findOne({ sensorNumber: identifier }, options);
            if (!sensor) throw new Error("Sensor not found.");
            return sensor
        } else if (sensorVal.valid_string(identifier)) {
            const sensor = await sensorCollection.findOne({ sensorName: identifier }, options);
            if (!sensor) throw new Error("Sensor not found.");
            return sensor
        } else throw new Error("Invalid identifier.");
    } catch (e) {
        throw new Error("Error retrieving sensor details.");
    }
}

// Update sensor details
const updateSensor = async (sensorId, updateData) => {
    try {
        const sensorCollection = await sensors();
        const sensor = await getSensorByIdOrName(sensorId);
        if (!sensor) throw new Error("Sensor not found.");

        const updatedSensor = await sensorCollection.updateOne(
            { _id: sensor._id },
            { $set: updateData });
        return await getSensorByIdOrName(sensorId);
    } catch (e) {
        throw new Error("Error updating sensor details.");
    }
}

// Delete a sensor from the database
const deleteSensor = async (sensorId) => {
    try {
        const sensorCollection = await sensors();
        const sensor = await getSensorByIdOrName(sensorId);
        if (!sensor) throw new Error("Sensor not found.");
        const deleted_sensor = await sensorCollection.deleteOne({ _id: sensor._id });
        if (deleted_sensor.deletedCount === 0) throw new Error("Could not delete sensor.");
        return { deleted: true, data: sensor };
    } catch (e) {
        throw new Error("Error deleting sensor.");
    }
}

export default { addSensor, getSensorByIdOrName, getAllSensors, updateSensor, deleteSensor }
