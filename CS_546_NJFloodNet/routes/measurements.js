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
import {
  verifyDecodedDump,
  verifyInt,
  verifyMongoId,
  verifyNumber,
  verifyStr,
  verifyTimestamp,
  verifyVoltage,
  verifySensorNumber,
} from "../helpers.js";
import measurementsData from "../data/measurements.js";
import sensorData from "../data/sensors.js";
// TODO: Data functions
// import { getMovieById, searchMoviesByTitle } from "../data/movies.js";
// TODO: Make helper file?
// import { verifyStr } from "../helpers.js";

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

  console.log(req.body);

  let timestamp = datestamp;

  // Do error checking
  let errors = [];

  try {
    voltage = verifyVoltage(voltage);
  } catch (e) {
    errors.push(e);
  }
  try {
    distanceMm = verifyNumber(distanceMm, `distanceMm`);
  } catch (e) {
    errors.push(e);
  }
  try {
    errorCode = verifyInt(errorCode, `errorCode`);
  } catch (e) {
    errors.push(e);
  }
  try {
    eventAccMm = verifyNumber(eventAccMm, `eventAccMm`);
  } catch (e) {
    errors.push(e);
  }
  try {
    rainAccMm = verifyNumber(rainAccMm, `rainAccMm`);
  } catch (e) {
    errors.push(e);
  }
  try {
    totalAccMm = verifyNumber(totalAccMm, `totalAccMm`);
  } catch (e) {
    errors.push(e);
  }
  try {
    rainIntensity = verifyNumber(rainIntensity, `rainIntensity`);
  } catch (e) {
    errors.push(e);
  }
  try {
    timestamp = verifyTimestamp(timestamp);
  } catch (e) {
    errors.push(e);
  }
  try {
    sensorNumber = verifySensorNumber(sensorNumber);
  } catch (e) {
    errors.push(e);
  }

  if (errors.length > 0) {
    console.log(errors);
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
    console.log("addMeasurement failed");
    console.log(e);
    return res.status(400).json({ error: `Adding measurement failed` });
  }

  console.log(sensorNumber);
  console.log(sensor);

  return res.redirect(`/${sensorId}`);
});

router.route("/:sensorId").get(async (req, res) => {
  let sensorId = req.params.sensorId;

  try {
    sensorId = verifyMongoId(sensorId, `sensorId`);
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
