export const verifyStr = (s, type) => {
  if (typeof s !== "string")
    throw new Error(`${type} must be a string: it was instead ${typeof s}`);
  s = s.trim();
  if (s.length === 0) throw new Error(`${type} must be non-empty`);
  return s;
};

export const verifyUserId = (userId) => {
  const userIdMinLen = 5;
  const userIdLaxLen = 10;

  userId = verifyStr(userId, `userId`);
  // simple regex that checks for no spaces
  let userIdRegex = /^(?!.*[\s]).+$/;
  if (!userIdRegex.test(userId))
    throw new Error(`User ID a string without spaces`);
  if (userId.length < userIdMinLen || userId.length > userIdLaxLen)
    throw new Error(
      `userId must be between ${userIdMinLen} and ${userIdLaxLen} characters`
    );
  return userId.toLowerCase();
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
  if (!passwordRegex.test(pass))
    throw new Error(
      `Password must have a number, special character, and an uppercase.`
    );

  return password;
};
