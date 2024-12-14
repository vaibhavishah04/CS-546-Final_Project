/**
 * measurements.js (Routes)
 *
 * Tasks:
 * 1. Define routes for measurement-related actions.
 * 2. Connect endpoints to functions in data/measurements.js.
 *
 * Endpoints:
 * - POST /measurements: Add a new measurement.
 * - GET /measurements/:sensorId: Retrieve measurements for a sensor.
 */
/**
 * Define API endpoints for measurement-related actions.
 * Connect these routes to the functions in `data/measurements.js`.
 */

// Add a new measurement to a sensor
// function addMeasurementRoute(req, res) {}

// Retrieve all measurements for a sensor
// function getMeasurementsRoute(req, res) {}

// Update an existing measurement
// function updateMeasurementRoute(req, res) {}

// Delete a measurement
// function deleteMeasurementRoute(req, res) {}

import { Router } from "express";
const router = Router();
import measurementsData from "../data/measurements.js";
import sensorData from "../data/sensors.js";
import validation from "../helpers.js";

router.route("/").post(async (req, res) => {
  // get data from req.body
  let {
    datestamp,
    errorCode,
    voltage,
    distanceMm,
    eventAccMm,
    rainAccMm,
    totalAccMm,
    rainIntensity,
    sensorNumber,
  } = req.body;

  let timestamp = datestamp;

  // Do error checking
  let errors = [];

  try {
    voltage = validation.verifyVoltage_str(voltage);
  } catch (e) {
    errors.push(e);
  }
  try {
    distanceMm = validation.verifyNumber_str(distanceMm, `distanceMm`);
  } catch (e) {
    errors.push(e);
  }
  try {
    errorCode = validation.verifyInt_str(errorCode, `errorCode`);
  } catch (e) {
    errors.push(e);
  }
  try {
    eventAccMm = validation.verifyNumber_str(eventAccMm, `eventAccMm`);
  } catch (e) {
    errors.push(e);
  }
  try {
    rainAccMm = validation.verifyNumber_str(rainAccMm, `rainAccMm`);
  } catch (e) {
    errors.push(e);
  }
  try {
    totalAccMm = validation.verifyNumber_str(totalAccMm, `totalAccMm`);
  } catch (e) {
    errors.push(e);
  }
  try {
    rainIntensity = validation.verifyNumber_str(rainIntensity, `rainIntensity`);
  } catch (e) {
    errors.push(e);
  }
  try {
    timestamp = validation.verifyTimestamp(timestamp);
  } catch (e) {
    errors.push(e);
  }
  try {
    sensorNumber = validation.verifySensorNumber(sensorNumber);
  } catch (e) {
    errors.push(e);
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // add data to the sensor
  // addMeasurement(sensorId, measurementData)
  let sensor;
  try {
    sensor = await measurementsData.addMeasurement(sensorNumber, {
      timestamp,
      errorCode,
      voltage,
      distanceMm,
      eventAccMm,
      rainAccMm,
      totalAccMm,
      rainIntensity,
    });
  } catch (e) {
    return res
      .status(400)
      .json({ error: `Adding measurement failed. Error: ${e}` });
  }

  // Return a json here since this is an API for the google scripts
  return res.status(200).json({ sensor });
});

router.route("/:sensorId").get(async (req, res) => {
  let sensorId = req.params.sensorId;

  try {
    sensorId = validation.verifyMongoId_str(sensorId, `sensorId`);
  } catch (e) {
    return res.status(400).json({ error: e });
  }

  let sensor;
  try {
    sensor = sensorData.getSensorByIdOrName(sensorId);
  } catch (e) {
    return res.status(404).json({ error: e });
  }

  // TODO: Add measurement page?
  return res.render("pages/measurement", { sensor });
});

export default router;
