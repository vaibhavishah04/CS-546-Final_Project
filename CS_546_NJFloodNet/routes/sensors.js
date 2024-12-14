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
 * - PUT /sensors/:id: Update a specific sensor.
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
// TODO: Data functions
// import { getMovieById, searchMoviesByTitle } from "../data/movies.js";
// TODO: Make helper file?
// import { verifyStr } from "../helpers.js";

router
  .route("/")
  .get(async (req, res) => {
    // GET ENDPOINT
  })
  .post(async (req, res) => {
    // POST ENDPOINT
  });

router
  .route("/:id")
  .get(async (req, res) => {
    // GET ENDPOINT
  })
  .put(async (req, res) => {
    // PUT ENDPOINT
  })
  .delete(async (req, res) => {
    // DELETE ENDPOINT
  });



  router.route("/sensors/:id/download").get( async (req, res) => {
    let _id = req.params.id;

    try {
      _id = validation.verifyMongoId_str(_id, `_id`);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    let sensor;
    try {
      sensor = await sensorData.getSensorByIdOrName(_id);
      const sensorDetails = JSON.stringify(sensor);
      const filename = `sensor_${sensor.sensorNumber}.json`;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  
      res.send(sensorDetails);
    } catch (e) {
      return res.status(404).json({ error: "Sensor not found" });
    }
      
  });
  

export default router;
