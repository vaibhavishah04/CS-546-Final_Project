/**
 * measurements.js
 *
 * Tasks:
 * 1. Add, retrieve, update, and delete measurement data.
 * 2. Link measurements to their respective sensors.
 *
 * Functions:
 * - addMeasurement(sensorId, measurementData): Add a new measurement.
 * - getMeasurements(sensorId, filters): Retrieve measurements for a sensor.
 * - updateMeasurement(measurementId, updateData): Update a specific measurement.
 * - deleteMeasurement(measurementId): Remove a measurement.
 */

// Add a new measurement linked to a sensor

import sensorData from "./sensors.js";
import sensorVal from "../validation/sensor_val.js";
import { ObjectId } from "mongodb";

const addMeasurement = async (sensorId, measurementData) => {
  // check if sensor exists
  let tgt_sensor = null;

  try {
    tgt_sensor = await sensorData.getSensorByIdOrName(sensorId);
  } catch (e) {
    throw new Error(`Sensor with id ${sensorId} not found`);
  }

  // check if measurement data is valid
  if (!sensorVal.valid_measurements([measurementData])) {
    throw new Error(`Invalid measurement data`);
  }

  measurementData = { _id: new ObjectId(), ...measurementData };

  // add measurement to sensor
  tgt_sensor.measurements.push(measurementData);
  let updated_sensor = await sensorData.updateSensor(
    tgt_sensor._id,
    tgt_sensor
  );

  return updated_sensor;
};

// Retrieve all measurements for a sensor with optional filters
const getMeasurements = async (sensorId, options = {}) => {
  // check if sensor exists
  let tgt_sensor = null;
  try {
    tgt_sensor = await sensorData.getSensorByIdOrName(sensorId, options);
    return tgt_sensor.measurements;
  } catch (e) {
    throw new Error(`Sensor with id ${sensorId} not found`);
  }
};

// Update a specific measurement
const updateMeasurement = async (measurementId, updateData) => {
  // find sensor with the measurement
  const all_sensors = await sensorData.getAllSensors();
  let tgt_sensor = null;
  let tgt_measurement = null;

  for (let sensor of all_sensors) {
    let measurement_idx = sensor.measurements.indexOf(
      (m) => m._id === measurementId
    );
    if (measurement_idx) {
      tgt_sensor = sensor;
      tgt_measurement = measurement_idx;
      break;
    }
  }

  if (!tgt_sensor || !tgt_measurement) {
    throw new Error(`Measurement with id ${measurementId} not found`);
  }

  // update measurement
  tgt_sensor.measurements[tgt_measurement] = Object.assign(
    tgt_sensor.measurements[tgt_measurement],
    updateData
  );
  let updated_sensor = await sensorData.updateSensor(tgt_sensor.id, tgt_sensor);

  return updated_sensor;
};

// Delete a measurement
const deleteMeasurement = async (measurementId) => {
  // find sensor with the measurement
  const all_sensors = await sensorData.getAllSensors();
  let tgt_sensor = null;
  let tgt_measurement = null;

  for (let sensor of all_sensors) {
    let measurement_idx = sensor.measurements.indexOf(
      (m) => m._id === measurementId
    );
    if (measurement_idx) {
      tgt_sensor = sensor;
      tgt_measurement = measurement_idx;
      break;
    }
  }

  if (!tgt_sensor || !tgt_measurement) {
    throw new Error(`Measurement with id ${measurementId} not found`);
  }

  // delete measurement
  tgt_sensor.measurements.splice(tgt_measurement, 1);
  let updated_sensor = await sensorData.updateSensor(tgt_sensor.id, tgt_sensor);

  return updated_sensor;
};

export default {
  addMeasurement,
  getMeasurements,
  updateMeasurement,
  deleteMeasurement,
};
