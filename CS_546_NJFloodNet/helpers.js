/**
 * Verifies that a given string is a non-empty string, and trims it
 * @param {string} s - a string to be verified
 * @param {string} type - the variable to be tested
 * @returns {string} s, trimmed
 */
const verifyStr = (s, type) => {
  if (typeof s !== "string")
    throw new Error(`${type} must be a string: it was instead ${typeof s}`);
  s = s.trim();
  if (s.length === 0) throw new Error(`${type} must be non-empty`);
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

export const verifyNumber = (number, type) => {
  number = verifyStr(number, `number`);
  number = Number(number);
  if (typeof number !== "number") throw new Error(`${type} must be a number`);
  if (Number.isNaN(number)) throw new Error(`${type} must not be NaN`);
  return number;
};

export const verifyInt = (int, type) => {
  int = verifyStr(int, `int`);
  int = verifyNumber(int, type);
  if (Number.isNaN(int)) throw new Error(`${type} must not be NaN`);
  if (!Number.isInteger(int)) throw new Error(`${type} must be an integer`);
  return int;
};

export const verifyVoltage = (voltage) => {
  voltage = verifyStr(voltage, `voltage`);
  voltage = verifyNumber(voltage, `voltage`);
  if (voltage < 0 || voltage > 5)
    throw new Error(`voltage must be between 0 and 5`);
  return voltage;
};

export const verifyMongoId = (mongoId, type) => {
  mongoId = verifyStr(mongoId, type);
  if (!ObjectId.isValid(mongoId)) throw new Error(`${type} must be a mongo id`);
  return mongoId;
};

export const verifyArray = (array, type) => {
  if (!Array.isArray(array))
    throw new Error(`${type} must be an array. It was ${typeof array} instead`);
  return array;
};

export const verifyTimestamp = (dateString) => {
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

export const verifyDecodedDump = (dump) => {
  dump = verifyStr(dump, `dump`);
  let jsonObj = JSON.parse(dump);
  return dump;
};

export const verifySensorNumber = (sensorNumber) => {
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

export default { verifyStr, verifyUsername, verifyPassword };
