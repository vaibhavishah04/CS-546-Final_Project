import userData from "./users.js";
import sensorVal from "../validation/sensor_val.js";
import userVal from "../validation/user_val.js";
import { reports } from "../config/mongoCollections.js";

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
  username,
  timestamp,
  location,
  reportText,
  reportImage
) => {
  try {
    // Validate the input data
    const userIdOk = userData.getUserById(user_id);
    if (userIdOk === null) throw new Error("Invalid user_id");

    const usernameOk = userVal.valid_username(username);
    if (!usernameOk) throw new Error("Invalid username");

    const timestampOk = sensorVal.valid_timestamp(timestamp);
    if (!timestampOk) throw new Error("Invalid timestamp");

    const locationOk = sensorVal.valid_string(location);
    if (!locationOk) throw new Error("Invalid location");

    const reportTextOk =
      sensorVal.valid_string(reportText) && reportText.length <= 500;
    if (!reportTextOk)
      throw new Error(
        "Invalid report text. Must be a string with maximum length of 500 characters."
      );

    // If an image is provided, validate and save it. Skip if no image is provided.

    let imageUrl = null;

    if (reportImage) {
      // 1. Validate the image file type and size
      // 2. Upload the image to a storage service (e.g., AWS S3, Google Cloud Storage, etc.)
      // 3. Save the URL of the uploaded image in the report data
      // TODO: Implement image validation and upload logic here
    }

    const reportData = await reports();
    const newReport = {
      user_id: new ObjectId(user_id),
      username: username,
      timestamp: new Date(timestamp),
      location: location,
      reportText: reportText,
      reportImage: imageUrl,
    };
    const insertInfo = await reportData.insertOne(newReport);
    const insertedReport = await reportData.findOne(insertInfo.insertedId);
    return insertedReport;
  } catch (e) {
    throw new Error(e);
  }
};

// Retrieve all reports with optional filters
const getAllReports = async (options = {}) => {
  try {
    const reportData = await reports();
    const allReports = await reportData.find(options).toArray();
    return allReports;
  } catch (e) {
    throw new Error(e);
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
