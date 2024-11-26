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
// TODO: Data functions
// import { getMovieById, searchMoviesByTitle } from "../data/movies.js";
// TODO: Make helper file?
// import { verifyStr } from "../helpers.js";

router.route("/").post(async (req, res) => {
  // POST ENDPOINT
});

router.route("/:sensorId").get(async (req, res) => {
  // GET ENDPOINT
});

export default router;
