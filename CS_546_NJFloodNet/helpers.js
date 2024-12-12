export const verifyStr = (s, type) => {
  if (typeof s !== "string")
    throw new Error(`${type} must be a string: it was instead ${typeof s}`);
  s = s.trim();
  if (s.length === 0) throw new Error(`${type} must be non-empty`);
  return s;
};

export const verifyUsername = (username) => {
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

export const verifyPassword = (password) => {
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
  if (typeof number !== "number") throw new Error(`${type} must be a number`);
  return verifyErrorCode;
};

export const verifyInt = (int, type) => {
  int = verifyNumber(int, type);
  if (!Number.isInteger(int)) throw new Error(`${type} must be an integer`);
  return int;
};

export const verifyVoltage = (voltage) => {
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

// ONLY USERS CAN REPORT
