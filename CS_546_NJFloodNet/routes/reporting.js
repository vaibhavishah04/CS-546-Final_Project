import { Router } from "express";
import measurementdata from "../data/measurements.js";
import dashboardrouter from "./dashboard.js";
const router = Router();

router.route("/").get(async (req, res) => {
  try{
    const filePath = path.resolve('static','webpage.html');

    res.sendFile(filePath);
  }
  catch(e)
  {
      res.status(500).json({error:e.message});
  }
});
export default router;
