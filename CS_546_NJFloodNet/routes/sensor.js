/**
 * sensors.js (Routes)
 *
 * Tasks:
 * 1. Define routes for sensor-related actions.
 * 2. Connect endpoints to functions in data/sensors.js.
 *
 * Endpoints:
 * - GET /sensors: Retrieve all sensors.
 * - GET /sensors/:id: Retrieve a specific sensor by ID.
 * - POST /sensors: Add a new sensor.
 * - PATCH /sensors/:id: Update a specific sensor.
 * - DELETE /sensors/:id: Remove a sensor.
 */
/**
 * Define API endpoints for sensor-related actions.
 * Connect these routes to the functions in `data/sensors.js`.
 */

// Retrieve all sensors
// function getAllSensorsRoute(req, res) {}

// Retrieve a sensor by ID
// function getSensorByIdRoute(req, res) {}

// Add a new sensor
// function addSensorRoute(req, res) {}

// Update an existing sensor
// function updateSensorRoute(req, res) {}

// Delete a sensor
// function deleteSensorRoute(req, res) {}

import { Router } from "express";
const router = Router();
import sensorData from "../data/sensors.js";
import validation from "../validation.js";
import sensorValidation from "../validation/sensor_val.js";

router.route("/:id").get(async (req, res) => {
  let _id = req.params.id;

  try {
    _id = validation.verifyMongoId_str(_id, `_id`);
  } catch (e) {
    // TODO: route this to a error page?
    return res.status(400).json({ error: e });
  }

  let sensor;
  try {
    sensor = sensorData.getSensorByMongoIdStr(_id);
  } catch (e) {
    return res.status(404).json({ error: e });
  }

  // TODO: Add sensor ejs file
  return res.render("pages/sensors", { sensor });
});

export default router;
