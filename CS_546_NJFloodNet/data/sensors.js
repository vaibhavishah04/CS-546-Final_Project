/**
 * Manage CRUD operations for sensors and their data.
 */

import { sensors } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import sensorVal from "../validation/sensor_val.js";
import validation from "../validation.js";

// Add a new sensor to the database
const addSensor = async (
  sensorNumber,
  sensorName,
  addedBy,
  coords,
  location,
  image
) => {
  if (typeof sensorData !== "object" || Array.isArray(sensorData))
    throw new Error("Invalid sensor data.");
  sensorNumber = validation.verifySensorNumber(sensorNumber);
  sensorName = validation.verifyStr(sensorName, `sensorName`);
  addedBy = validation.verifyMongoId_str(addedBy);
  if (!sensorVal.valid_coordinates(coords))
    throw new Error("Invalid coordinates.");
  location = validation.verifyStr(location, `location`);
  if (!sensorVal.valid_impath(image)) throw new Error("Invalid image path.");

  const sensorCollection = await sensors();
  measurements = [];
  notes = [];
  try {
    sensorCollection.insertOne({
      sensorNumber: sensorNumber,
      sensorName: sensorName,
      addedBy: ObjectId.createFromHexString(addedBy),
      coords: coords,
      location: location,
      image: image,
      measurements: measurements,
      notes: notes,
    });
    return getSensorByIdOrName(sensorNumber);
  } catch (e) {
    throw new Error("Error adding sensor to the database.");
  }
};

// Retrieve all sensors
const getAllSensors = async () => {
  const sensorCollection = await sensors();
  try {
    return await sensorCollection.find({}).toArray();
  } catch (e) {
    throw new Error("Error retrieving sensors from the database.");
  }
};

// Retrieve sensor details by ID, name, or number
const getSensorByIdOrName = async (identifier, options = {}) => {
  const sensorCollection = await sensors();
  try {
    let sensorNumber = validation.verifySensorNumber(identifier);
    // if this continues, it's a valid sensor number
    const sensor = await sensorCollection.findOne({ sensorNumber }, options);
    if (sensor) return sensor;
  } catch (e) {
    // Intentional No Op
  }
  try {
    let objectId_str = validation.verifyMongoId_str(identifier);
    // if this continues, it's a valid object ID
    const sensor = await sensorCollection.findOne(
      { _id: ObjectId.createFromHexString(objectId_str) },
      options
    );
    if (sensor) return sensor;
  } catch (e) {
    // Intentional No Op
  }
  try {
    let sensorName = validation.verifyStr(identifier);
    // if this continues, it's a valid string
    const sensor = await sensorCollection.findOne({ sensorName }, options);
    if (sensor) return sensor;
  } catch (e) {
    // Intentional No Op
  }
  // If we haven't returned by now, we can't find it.
  throw new Error(`sensor not found`);
};

export const getSensorByMongoId = async (id) => {
  if (!ObjectId.isValid(id)) throw new Error(`id not valid. id: ${id}`);
  const sensorCollection = await sensors();
  const sensor = await sensorCollection.findOne(id);
  return sensor;
};

export const getSensorByMongoIdStr = async (id) => {
  id = validation.verifyStr(id, `id`);
  if (!ObjectId.isValid(id)) throw new Error(`id not valid. id: ${id}`);
  const sensorCollection = await sensors();
  const sensor = await sensorCollection.findOne({
    _id: ObjectId.createFromHexString(id),
  });
  if (!sensor) throw new Error(`sensor with id ${id} not found`);
  return sensor;
};

// Update sensor details
const updateSensor = async (sensorId, updateData) => {
  try {
    const sensorCollection = await sensors();
    const sensor = await getSensorByMongoId(sensorId);
    if (!sensor) throw new Error("Sensor not found.");

    const updatedSensor = await sensorCollection.updateOne(
      { _id: sensor._id },
      { $set: updateData }
    );
    return await getSensorByMongoId(sensorId);
  } catch (e) {
    throw new Error(`Error updating sensor details: ${e}`);
  }
};

// Delete a sensor from the database
const deleteSensor = async (sensorId) => {
  try {
    const sensorCollection = await sensors();
    const sensor = await getSensorByIdOrName(sensorId);
    if (!sensor) throw new Error("Sensor not found.");
    const deleted_sensor = await sensorCollection.deleteOne({
      _id: sensor._id,
    });
    if (deleted_sensor.deletedCount === 0)
      throw new Error("Could not delete sensor.");
    return { deleted: true, data: sensor };
  } catch (e) {
    throw new Error("Error deleting sensor.");
  }
};

// Append a note to a sensor's notes array
const addNoteToSensor = async (sensorId, note, username) => {
  if (!ObjectId.isValid(sensorId)) throw new Error("Invalid sensor ID.");
  note = validation.verifyStr(note, "note");
  username = validation.verifyStr(username, "username");

  const sensorCollection = await sensors();
  const objectId = new ObjectId(sensorId);

  const sensor = await getSensorByMongoId(objectId);
  if (!sensor) throw new Error("Sensor not found.");

  try {
    const noteObject = {
      _id: new ObjectId(),
      text: note,
      author: username,
      timestamp: new Date().toISOString(),
    };

    const updateResult = await sensorCollection.updateOne(
      { _id: objectId },
      { $push: { notes: noteObject } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error("Failed to add note to sensor.");
    }

    return await getSensorByMongoId(objectId);
  } catch (e) {
    throw new Error(`Error adding note to sensor: ${e.message}`);
  }
};

// Update a specific note
const updateNote = async (sensorId, noteId, newText, username) => {
  const sensorCollection = await sensors();
  const objectId = new ObjectId(sensorId);

  const result = await sensorCollection.updateOne(
    {
      _id: objectId,
      "notes._id": new ObjectId(noteId),
      "notes.author": username,
    },
    { $set: { "notes.$.text": newText, "notes.$.timestamp": new Date() } }
  );

  if (result.modifiedCount === 0) {
    throw new Error("Unauthorized or note not found.");
  }
  return await getSensorByMongoId(objectId);
};

// Delete a specific note
const deleteNote = async (sensorId, noteId, username) => {
  const sensorCollection = await sensors();
  const objectId = new ObjectId(sensorId);

  const result = await sensorCollection.updateOne(
    { _id: objectId },
    { $pull: { notes: { _id: new ObjectId(noteId), author: username } } }
  );

  if (result.modifiedCount === 0) {
    throw new Error("Unauthorized or note not found.");
  }
  return await getSensorByMongoId(objectId);
};

export default {
  addSensor,
  getSensorByIdOrName,
  getAllSensors,
  updateSensor,
  deleteSensor,
  getSensorByMongoId,
  getSensorByMongoIdStr,
  addNoteToSensor,
  updateNote,
  deleteNote,
};
