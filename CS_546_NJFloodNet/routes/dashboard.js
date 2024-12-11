import { Router } from "express";
import sensordata from "../data/sensors.js"
import measurementdata from "../data/measurements.js";
const router = Router();

router.route("/").get(
   (req, res, next) => {
    
    next();
  },
  async (req, res) => {
    try{

      const sensors = await sensordata.getAllSensors();
      const measurements = await measurementdata.getMeasurements();
      return res.render("pages/dashboard", {sensors, measurements});
    }
    catch(e){
        res.status(500).send({message:e});
    }
  }
);

export default router;
