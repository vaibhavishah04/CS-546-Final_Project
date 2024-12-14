import { Router } from "express";
import measurementsData from "../data/measurements.js";
import sensorData from "../data/sensors.js";
import validation from "../helpers.js";
const router = Router();

// POST /measurements: adds the measurement in req.body to the database
// This acts as an API for the Google Script, so no pages are returned, just json
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

  // Changing the google script is significantly harder than just renaming it here, so it gets renamed here
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

  // If errors exist, return the list of errors
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
    // using errors and array here to match the format of the previous fail state
    return res
      .status(400)
      .json({ errors: [`Adding measurement failed. Error: ${e}`] });
  }

  // Return a json here since this is an API for the google scripts
  return res.json({ sensor });
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
