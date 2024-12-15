import { Router } from "express";
import validation from "../validation.js";
import multer from "multer";
import path from "path"; 
import  addReport  from "../data/reports.js";
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    res.render("pages/reporting");
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/reporting/add', upload.single("reportImage"), async (req, res) => {
  const { _id, user_id, timestamp, location, reportext } = req.body;
  const reportImage = req.file; 

  try {
    if (!reportext || !location) {
      return res.status(400).json({ error: "Description and Location are required." });
    }

    validation.imageValidation(req.body, reportImage);

    const addReportingData = await addReport(_id, user_id, timestamp, location, reportext, reportImage);

    res.status(200).json({ 
      success: true,
      message: 'Reporting submitted successfully!',
      report: addReportingData
    });
  } catch (e) {
    console.error("Error in /reporting/add:", error);

    res.status(500).json({ error: "Internal Server Error", details: e.message });
  }
});

export default router;
