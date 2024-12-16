import { ObjectId } from "mongodb";
import path from 'path';

/**
 * Verifies that a given string is a non-empty string, and trims it
 * @param {string} s - a string to be verified
 * @param {string} varName - the name of the variable being tested
 * @returns {string} s, trimmed
 */
const verifyStr = (s, varName) => {
  if (typeof s !== "string")
    throw new Error(`${varName} must be a string: it was instead ${typeof s}`);
  s = s.trim();
  if (s.length === 0) throw new Error(`${varName} must be non-empty`);
  return s;
};

/**
 * Verifies that a given username fits the username parameters
 * @param {string} username - username of a user as a string
 * @returns {string} the given username, trimmed
 */
const verifyUsername = (username) => {
  const usernameMinLen = 5;
  const usernameLaxLen = 10;

  username = verifyStr(username, `username`);
  // simple regex that checks for no spaces
  let usernameRegex = /^(?!.*[\s]).+$/;
  if (!usernameRegex.test(username))
    throw new Error(`User ID a string without spaces`);
  if (username.length < usernameMinLen || username.length > usernameLaxLen)
    throw new Error(
      `username must be between ${usernameMinLen} and ${usernameLaxLen} characters`
    );
  return username.toLowerCase();
};

/**
 * Verifies that a given username fits the username parameters
 * @param {string} password - password to be checked
 * @returns {string} the given password, trimmed
 */
const verifyPassword = (password) => {
  const passwordMinLen = 8;

  password = verifyStr(password, `password`);
  if (password.length < passwordMinLen)
    throw new Error(`password must be at least ${passwordMinLen} characters`);
  // (?=.*[0-9]) at least one number
  // (?=.*[^a-zA-Z\d\s]) at least one not alphanumeric char
  // (?=.*[A-Z]) at least one uppercase
  // (?!.*\s) not at least one space
  // .+ characters
  let passwordRegex = /^(?=.*[0-9])(?=.*[^a-zA-Z\d\s])(?=.*[A-Z])(?!.*\s).+$/;
  if (!passwordRegex.test(password))
    throw new Error(
      `Password must have a number, special character, and an uppercase.`
    );

  return password;
};

/**
 * Validates an input to a number and checks that it is finite and not NaN
 * @param {string} number - string to be checked
 * @param {string} varName - the name of the variable being tested
 * @returns {number} the given input, as a number
 */
const verifyNumber_str = (number, varName) => {
  number = verifyStr(number, `number`);
  number = Number(number);
  if (typeof number !== "number")
    throw new Error(`${varName} must be a number`);
  if (Number.isNaN(number)) throw new Error(`${varName} must not be NaN`);
  if (!Number.isFinite(number)) throw new Error(`${varName} must be finite`);
  return number;
};

/**
 * Validates an input to a number and checks that it is an integer, finite, and not NaN
 * @param {string} int - string to be checked
 * @param {string} varName - the name of the variable being tested
 * @returns {number} the given input, as a number
 */
const verifyInt_str = (int, varName) => {
  int = verifyStr(int, `int`);
  int = verifyNumber_str(int, varName);
  if (!Number.isInteger(int)) throw new Error(`${varName} must be an integer`);
  return int;
};

/**
 * Validates a string to be a voltage: a number between 0 and 5
 * @param {string} voltage - voltage to be checked
 * @returns {number} the given input, as a number
 */
const verifyVoltage_str = (voltage) => {
  voltage = verifyStr(voltage, `voltage`);
  voltage = verifyNumber_str(voltage, `voltage`);
  if (voltage < 0 || voltage > 5)
    throw new Error(`voltage must be between 0 and 5`);
  return voltage;
};

/**
 * Validates the string to be a mongoId
 * @param {string} mongoId - the string to be checked
 * @param {string} varName - the name of the variable being tested
 * @returns {string} the given string, trimmed
 */
const verifyMongoId_str = (mongoId, varName) => {
  mongoId = verifyStr(mongoId, varName);
  if (!ObjectId.isValid(mongoId))
    throw new Error(`${varName} must be a mongo id`);
  return mongoId;
};

/**
 * Validates given object to be an array
 * @param {object} array - an array to be checked
 * @param {string} varName - the name of the variable being tested
 * @returns {object} the given array
 */
const verifyArray = (array, varName) => {
  if (!Array.isArray(array))
    throw new Error(
      `${varName} must be an array. It was ${typeof array} instead`
    );
  return array;
};

/**
 * Validates and correctly formats a time stamp
 * @param {string} dateString - A string representation of a date, given by the google script
 * @returns {string} The string as it is used in the DB: DD-MM-YYYY-HH:MM:SS
 */
const verifyTimestamp = (dateString) => {
  dateString = verifyStr(dateString, `timestamp`);
  let date = new Date(dateString);
  let time = date.toTimeString().substring(0, 8);
  let day = String(date.getDate());
  if (day.length < 2) day = `0${day}`;
  let month = String(date.getMonth() + 1);
  if (month.length < 2) month = `0${month}`;
  let year = date.getFullYear();
  dateString = `${day}-${month}-${year}-${time}`;
  return dateString;
};

/**
 * Validates a sensor number to be a positive integer
 * @param {number} sensorNumber - The sensor number, as given by the google script
 * @returns {number} The given sensor number
 */
const verifySensorNumber = (sensorNumber) => {
  if (typeof sensorNumber !== "number")
    throw new Error(`sensorNumber must be a number`);
  if (Number.isNaN(sensorNumber))
    throw new Error(`sensorNumber must not be NaN`);
  if (!Number.isInteger(sensorNumber))
    throw new Error(`sensorNumber must be an integer`);
  if (sensorNumber < 1)
    throw new Error(`sensorNumber must be greater than or equal to 1`);
  return sensorNumber;
};

/**
 * Validates a report as a string with under 500 characters
 * @param {string} reportText - The report to be validated
 * @returns {number} The report, trimmed
 */
const verifyReportText = (reportText) => {
  const maxReportTextLength = 500;

  reportText = verifyStr(reportText, `report`);
  if (reportText.length > maxReportTextLength)
    throw new Error(
      `Reports must be less than ${maxReportTextLength} characters, this was ${reportText.length}`
    );
  return reportText;
};

const imageValidation = ( reportImage )=>{

  if (reportImage && !["image/jpeg", "image/png", "image/gif"].includes(reportImage.mimetype)) {
    throw "Invalid file type. Only images are allowed.";
  }
  if (!reportImage) {
    return true;
  }

  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

  if (!allowedMimes.includes(reportImage.mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.');
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (reportImage.size > maxSize) {
    throw new Error('File is too large. Max size is 5MB.');
  }

  return true;
};

export default {
  verifyStr,
  verifyUsername,
  verifyPassword,
  verifyNumber_str,
  verifyInt_str,
  verifyVoltage_str,
  verifyMongoId_str,
  verifyArray,
  verifyTimestamp,
  verifySensorNumber,
  verifyReportText,
  imageValidation,
};
