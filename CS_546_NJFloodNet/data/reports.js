import userData from "./users.js";
import sensorVal from "../validation/sensor_val.js";
import userVal from "../validation/user_val.js";
import { reports } from "../config/mongoCollections.js";
import validation from "../validation.js";
import { ObjectId } from "mongodb";

/**
 * reports.js
 *
 * Tasks:
 * 1. Add, retrieve, update, and delete flood reports.
 * 2. Manage image uploads and storage for reports.
 *
 * Functions:
 * - addReport(reportData): Submit a new flood report.
 * - getAllReports(filters): Retrieve all flood reports.
 * - updateReport(reportId, updateData): Update an existing report.
 * - deleteReport(reportId): Remove a report.
 */
// Add a new report, including optional image uploads
const addReport = async (
  user_id,
  location,
  reportText,
  reportImage,
  alt_text
) => {
  // Validate the input data
  const userIdOk = await userData.getUserById(user_id);
  if (userIdOk === null) throw new Error("Invalid user_id");

  location = validation.verifyStr(location, `location`);
  reportText = validation.verifyReportText(reportText);
  alt_text =validation.verifyStr(alt_text,'alt_text');

  // If an image is provided, validate and save it. Skip if no image is provided.

  if (reportImage) {
    
    if (reportImage) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      const maxSize = 5 * 1024 * 1024; 
    
      if (!allowedTypes.includes(reportImage.mimetype)) {
        throw new Error("Invalid image type. Only JPG, PNG, and GIF allowed.");
      }
    
      if (reportImage.size > maxSize) {
        throw new Error("Image exceeds 5MB size limit.");
      }
        
  }
}

  const reportData = await reports();
  const newReport = {
    user_id: user_id,
    timestamp: new Date(),
    location: location,
    reportText: reportText,
    reportImage: reportImage.path,
    alt_text: alt_text
  };
  const insertInfo = await reportData.insertOne(newReport);
  const insertedReport = await reportData.findOne(insertInfo.insertedId);
  return insertedReport;
};

// Retrieve all reports with optional filters
const getAllReports = async (options = {}) => {
  try {
    const reportData = await reports();
    const allReports = await reportData.find(options).toArray();
    return allReports;
  } catch (e) {
    throw new Error(`Unable to retrieve data.'${e}`);
  }
};

// Update an existing report
const updateReport = async (reportId, updateData) => {
  try {
    const reportData = await reports();
    const updateInfo = await reportData.findOneAndUpdate(
      { _id: new ObjectId(reportId) },
      { $set: updateData },
      { returnOriginal: false }
    );
    return updateInfo.value;
  } catch (e) {
    throw new Error(e);
  }
};

// Delete a report
const deleteReport = async (reportId) => {
  try {
    const reportData = await reports();
    const deleteInfo = await reportData.findOneAndDelete({
      _id: new ObjectId(reportId),
    });
    return true;
  } catch (e) {
    throw new Error(e);
  }
};

export default { addReport, getAllReports, updateReport, deleteReport };
