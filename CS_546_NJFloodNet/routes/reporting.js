import {Router} from "express";
import measurementdata from "../data/measurements.js";
import dashboardrouter from "./dashboard.js";
const router = Router();

router.route("/").get((req, res, next)=>{

    next();
},

async (req, res) =>
{
    try{
        res.render("pages/reporting");
    }
    catch(e)
    {
        res.status(500).send({error :'Internal Server Error'})
    }

}

);
export default router;