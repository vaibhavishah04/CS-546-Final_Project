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
  let { reportLocation, reportText, alt_text } = req.body;
  let reportImage = req.file;

  // xss
  reportLocation = xss(reportLocation);
  reportText = xss(reportText);
  alt_text = xss(alt_text);
  reportImage = xss(reportImage);

  errors = [];
  try {
    reportLocation = validation.verifyStr(reportLocation, `reportLocation`);
  } catch (e) {
    errors.push(e.message);
  }
  try {
    reportText = validation.verifyStr(reportText, `reportText`);
  } catch (e) {
    errors.push(e.message);
  }
  try {
    alt_text = validation.verifyStr(alt_text, `alt_text`);
  } catch (e) {
    if (reportImage) errors.push(e.message);
  }
  try {
    reportImage = validation.imageValidation(reportImage);
  } catch (e) {
    if (reportImage) errors.push(e.message);
  }

  if (errors.length > 0) {
    return res.status(400).render("pages/reporting", {
      formData: { reportLocation, reportText, alt_text },
      errors,
    });
  }

  try {
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
    res
      .status(500)
      .json({ error: "Internal Server Error", details: e.message });
  }
});

export default router;
