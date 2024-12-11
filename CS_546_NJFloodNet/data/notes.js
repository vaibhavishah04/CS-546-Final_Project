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
const updateNote = async (sensorId, noteId, updateData) => {
    try {
        // check if sensor exists
        let sensor = await sensorData.getSensorByIdOrName(sensorId)
        // Find the note and update it
        let note = sensor.notes.find((note) => note._id.toString() === noteId)
        if (!note) throw new Error(`Note with id ${noteId} not found.`)
        
        // Check if the updateData is valid
        if (!sensorVal.valid_notes([updateData])) throw new Error("Invalid noteData")
        	
        // Update the note with the new data
        Object.assign(note, updateData)
        await sensorData.updateSensor(sensorId, sensor) 
        return note
    } catch (e) {
        throw new Error(e)
    }
} 

// Delete a note
const deleteNote = async (sensorId, noteId, userId) => {
    try {
        // check if sensor exists
        let sensor = await sensorData.getSensorByIdOrName(sensorId)
        
        // Find the index of the note to be deleted
        let index = sensor.notes.findIndex((note) => note._id.toString() === noteId);
        
        // If the note is not found, throw an error
        if (index === -1) throw new Error(`Note with id ${noteId} not found.`)
        
        // Check if the user is authorized to delete the note
        if (sensor.notes[index].user_id !== userId) throw new Error("You are not authorized to delete this note.")
            
        // Remove the note from the sensor's notes array
        let deletedNote = sensor.notes.splice(index, 1)[0]
        
        // Save the updated sensor document
        await sensorData.updateSensor(sensorId, sensor)

        return deletedNote
    } catch (e){
        throw new Error(e)
    }
}