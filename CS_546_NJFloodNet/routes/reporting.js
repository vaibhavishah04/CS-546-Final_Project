import {Router} from "express";
import measurementdata from "../data/measurements.js";
import router from "./dashboard.js";
const router = Router();

router.route("/").get((req, res, next)=>{

    next();
},

);