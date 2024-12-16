import { Router } from "express";
import validation from "../validation.js";
import multer from "multer";
import path from "path";
import reportFunctions from "../data/reports.js";
import xss from "xss";
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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

router.post("/add", upload.single("reportImage"), async (req, res) => {
  const { reportLocation, reportText, alt_text } = req.body;
  const reportImage = req.file;

  // xss
  reportLocation = xss(reportLocation);
  reportText = xss(reportText);
  alt_text = xss(alt_text);
  reportImage = xss(reportImage);

  try {
    if (!reportText || !reportLocation) {
      return res
        .status(400)
        .json({ error: "Description and Location are required." });
    }

    validation.imageValidation(reportImage);

    const addReportingData = await reportFunctions.addReport(
      req.session.userInfo.id,
      reportLocation,
      reportText,
      reportImage,
      alt_text
    );

    res.status(200).json({
      success: true,
      message: "Reporting submitted successfully!",
      report: addReportingData,
    });
  } catch (e) {
    console.error("Error in /reporting/add:", e);

    res
      .status(500)
      .json({ error: "Internal Server Error", details: e.message });
  }
});

export default router;
