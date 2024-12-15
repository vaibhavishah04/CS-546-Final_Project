import { Router } from "express";
import sensorData from "../data/sensors.js";
// import measurementdata from "../data/measurements.js";
const router = Router();

router.route("/").get(
  (req, res, next) => {
    next();
  },
  async (req, res) => {
    try {
      const sensors = await sensorData.getAllSensors();
      //const measurements = await measurementdata.getMeasurements();
      return res.render("pages/dashboard", { sensors });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }
);

// router.route('/dashboard/:').post(
//   (req,res, next) =>{
//     try{

//       if()
//     }
//     catch(e)
//     {
//       res.status(404).send('error',{error : 'No Result Found!'})
//     }
//   }
// )
export default router;
