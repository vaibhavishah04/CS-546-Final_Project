import { Router } from "express";
import measurementdata from "../data/measurements.js";
import dashboardrouter from "./dashboard.js";
const router = Router();

router.route("/").get(async (req, res) => {
  try {
    return res.render("pages/reporting");
  } catch (e) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});
export default router;
