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

router
  .route("/")
  .get(async (req, res) => {
    // get all sensors
    let sensors;
    try {
      sensors = await sensorData.getAllSensors();
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    // if there are no sensors, return error
    if (!sensors) return res.status(500).json({ error: e });

    return res.render("pages/sensors", { sensor: sensors });
  })
  .post(async (req, res) => {
    // get data
    let { sensorNumber, sensorName, addedBy, coords, location, status, notes } =
      req.body;

    // verify data
    let errors = [];
    try {
      sensorNumber = validation.verifyInt_str(sensorNumber, `sensorNumber`);
    } catch (e) {
      errors.push(e);
    }
    try {
      sensorName = validation.verifyStr(sensorName, `sensorName`);
    } catch (e) {
      errors.push(e);
    }
    try {
      addedBy = validation.verifyMongoId_str(addedBy, `addedBy`);
    } catch (e) {
      errors.push(e);
    }
    // TODO: better coords verification
    try {
      coords = validation.verifyStr(coords, `coords`);
    } catch (e) {
      errors.push(e);
    }
    try {
      location = validation.verifyStr(location, `location`);
    } catch (e) {
      errors.push(e);
    }
    try {
      status = validation.verifyStr(status, `status`);
    } catch (e) {
      errors.push(e);
    }
    try {
      notes = validation.verifyStr(notes, `notes`);
    } catch (e) {
      errors.push(e);
    }

    let sensor;
    // TODO: add images to sensors?
    try {
      sensor = await sensorData.addSensor(
        sensorNumber,
        sensorName,
        addedBy,
        coords,
        location,
        null
      );
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    if (!sensor) return res.status(500).json({ error: `Sensor not inserted` });

    // TODO: decide what to return on this route
    return res.json({ sensor });
    // maybe something like this
    // return res.redirect(`/sensor/${sensor._id}`);
  });

router
  .route("/:id")
  .get(async (req, res) => {
    let _id = req.params.id;

    try {
      _id = validation.verifyMongoId_str(_id, `_id`);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    let sensor;
    try {
      sensor = await sensorData.getSensorByIdOrName(_id);
    } catch (e) {
      return res.status(404).render("pages/error");
    }

    // Pass the single sensor to the EJS file
    return res.render("pages/sensors", { sensor });
  })
  .patch(async (req, res) => {
    // updateSensor = async (sensorId, updateData)
    let { sensorId, updateData } = req.body;
    let {
      sensorNumber,
      sensorName,
      addedBy,
      coords,
      location,
      status,
      measurements,
      notes,
    } = updateData;

    let errors = [];
    try {
      sensorId = validation.verifyMongoId_str(sensorId, `sensorId`);
    } catch (e) {
      errors.push(e);
    }
    if (sensorNumber) {
      try {
        sensorNumber = validation.verifyInt_str(sensorNumber, `sensorNumber`);
      } catch (e) {
        errors.push(e);
      }
    }
    if (sensorName) {
      try {
        sensorName = validation.verifyStr(sensorName, `sensorName`);
      } catch (e) {
        errors.push(e);
      }
    }
    if (addedBy) {
      try {
        addedBy = validation.verifyMongoId_str(addedBy, `addedBy`);
      } catch (e) {
        errors.push(e);
      }
    }
    // TODO: better coords verification
    if (coords) {
      try {
        coords = validation.verifyStr(coords, `coords`);
      } catch (e) {
        errors.push(e);
      }
    }
    if (location) {
      try {
        location = validation.verifyStr(location, `location`);
      } catch (e) {
        errors.push(e);
      }
    }
    if (status) {
      try {
        status = validation.verifyStr(status, `status`);
      } catch (e) {
        errors.push(e);
      }
    }
    if (measurements) {
      try {
        measurements = validation.verifyArray(measurements, `measurements`);
      } catch (e) {
        errors.push(e);
      }
    }
    if (notes) {
      try {
        notes = validation.verifyStr(notes, `notes`);
      } catch (e) {
        errors.push(e);
      }
    }

    if (errors.length > 0) return req.status(400).json({ errors });

    let sensor;
    try {
      sensor = await updateSensor(sensorId, {
        sensorNumber,
        sensorName,
        addedBy,
        coords,
        location,
        status,
        measurements,
        notes,
      });
    } catch (e) {
      return req.status(500).json({ error: e });
    }

    if (!sensor) return req.status(500).json({ error: `sensor not updated` });

    return req.json({ sensor });
  })
  .delete(async (req, res) => {
    // TODO: middleware on this route should turn away non-admins?
    // deleteSensor = async (sensorId)
    let { sensorId } = req.body;

    try {
      sensorId = validation.verifyMongoId_str(sensorId, `sensorId`);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    let deleted;
    try {
      deleted = await deleteSensor(sensorId);
    } catch (e) {
      return res.status(500).json({ error: e });
    }

    if (!deleted.deleted)
      return res.status(500).json({ error: `Sensor unable to be deleted` });

    // TODO: decide what to return here
    return res.json({ sensorData: deleted.data });
  });

export default router;
