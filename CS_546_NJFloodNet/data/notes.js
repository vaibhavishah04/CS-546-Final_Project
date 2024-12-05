/**
 * notes.js
 * 
 * Tasks:
 * 1. Add, retrieve, update, and delete notes for sensors.
 * 2. Associate notes with user and sensor IDs.
 * 
 * Functions:
 * - addNote(sensorId, noteData): Add a new note to a sensor.
 * - getNotes(sensorId): Retrieve all notes for a sensor.
 * - updateNote(noteId, updateData): Update a specific note.
 * - deleteNote(noteId): Remove a note.
 */
// Add a note to a sensor

import sensorData from "./sensors.js";
import sensorVal from "../validation/sensor_val.js";
import { ObjectId } from "mongodb";

export default {addNote, getNotes, updateNote, deleteNote};


const addNote = async (sensorId, userId, noteData) => {
    // check if sensor exists
    let sensor = null
    try {
        sensor = await sensorData.getSensorByIdOrName(sensorId)
    } catch (e) {
        throw new Error(`Sensor with id ${sensorId} not found.`)
    }

    // perform user validation here
    if (!sensorVal.valid_notes([noteData])) throw new Error("Invalid noteData")
    noteData = {"_id": new ObjectId(), "user_id": userId, ...noteData}
    sensor.notes.push(noteData)
    try { 
        const updatedSensor = await sensorData.updateSensor(sensorId, sensor)
        return updatedSensor
    } catch(e){
        throw new Error(e)
    }
}

// Retrieve all notes for a sensor
const getNotes = async (sensorId) => {
    // check if sensor exists
    let sensor = null
    try {
        sensor = await sensorData.getSensorByIdOrName(sensorId)
    } catch (e) {
        throw new Error(`Sensor with id ${sensorId} not found.`)
    }
    return sensor.notes
}

// Update a specific note
const updateNote = async (noteId, updateData) => {
    // what should our entry point be? Users? Sensors?
    return null
}

// Delete a note
const deleteNote = async (noteId) => {
    // what should our entry point be? Users? Sensors?
    return null
}