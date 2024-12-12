import { Router } from "express";
import sensordata from "../data/sensors.js";
import measurementdata from "../data/measurements.js";
const router = Router();

router.route("/").get(
  (req, res, next) => {
    next();
  },
  async (req, res) => {
    try{

      const sensors1 = await sensordata.getAllSensors();
      //const measurements = await measurementdata.getMeasurements();
      return res.render("pages/dashboard", {sensors: sensors1});
    }
    catch(e){
        res.status(404).send({error: 'No Result Found!'});
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
