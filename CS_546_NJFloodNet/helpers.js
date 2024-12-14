const verifyStr = (s, type) => {
    if (typeof s !== "string")
      throw new Error(`${type} must be a string: it was instead ${typeof s}`);
    s = s.trim();
    if (s.length === 0) throw new Error(`${type} must be non-empty`);
    return s;
  };

  const verifyUsername = (username) => {
    const usernameMinLen = 5;
    const usernameLaxLen = 10;

    username = verifyStr(username, `username`);
    let usernameRegex = /^(?!.*[\s]).+$/;
    if (!usernameRegex.test(username))
      throw new Error(`User ID must be a string without spaces`);
    if (username.length < usernameMinLen || username.length > usernameLaxLen)
      throw new Error(
        `username must be between ${usernameMinLen} and ${usernameLaxLen} characters`
      );
    return username.toLowerCase();
  };

  const verifyPassword = (password) => {
    const passwordMinLen = 8;

    password = verifyStr(password, `password`);
    if (password.length < passwordMinLen)
      throw new Error(`password must be at least ${passwordMinLen} characters`);
    let passwordRegex = /^(?=.*[0-9])(?=.*[^a-zA-Z\d\s])(?=.*[A-Z])(?!.*\s).+$/;
    if (!passwordRegex.test(password))
      throw new Error(
        `Password must have a number, special character, and an uppercase.`
      );

    return password;
  };

  const verifyNumber = (number, type) => {
    number = verifyStr(number, `number`);
    number = Number(number);
    if (typeof number !== "number") throw new Error(`${type} must be a number`);
    if (Number.isNaN(number)) throw new Error(`${type} must not be NaN`);
    return number;
  };

  const verifyInt = (int, type) => {
    int = verifyStr(int, `int`);
    int = verifyNumber(int, type);
    if (Number.isNaN(int)) throw new Error(`${type} must not be NaN`);
    if (!Number.isInteger(int)) throw new Error(`${type} must be an integer`);
    return int;
  };

  const verifyVoltage = (voltage) => {
    voltage = verifyStr(voltage, `voltage`);
    voltage = verifyNumber(voltage, `voltage`);
    if (voltage < 0 || voltage > 5)
      throw new Error(`voltage must be between 0 and 5`);
    return voltage;
  };

  const verifyMongoId = (mongoId, type) => {
    mongoId = verifyStr(mongoId, type);
    if (!ObjectId.isValid(mongoId)) throw new Error(`${type} must be a mongo id`);
    return mongoId;
  };

  const verifyArray = (array, type) => {
    if (!Array.isArray(array))
      throw new Error(`${type} must be an array. It was ${typeof array} instead`);
    return array;
  };

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

  const verifyDecodedDump = (dump) => {
    dump = verifyStr(dump, `dump`);
    JSON.parse(dump);
    return dump;
  };

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

  // Export all functions as a default object
  export default {
    verifyStr,
    verifyUsername,
    verifyPassword,
    verifyNumber,
    verifyInt,
    verifyVoltage,
    verifyMongoId,
    verifyArray,
    verifyTimestamp,
    verifyDecodedDump,
    verifySensorNumber,
  };
