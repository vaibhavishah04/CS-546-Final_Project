import validation from "../validation.js";

const valid_string = (s) => {
  if (typeof s === "string" && s.trim().length > 0) {
    return true;
  } else {
    return false;
  }
};

const valid_username = (username) => {
  username = validation.verifyStr(username, `username`);
  return (
    username.length <= 15 &&
    username.length >= 5 &&
    /^[a-zA-Z0-9_]+$/.test(username)
  );
};

const valid_password = (password) => {
  if (typeof password === "string" && password.length >= 8) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasNonAlphanumeric = /\W/.test(password);
    const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const cases = [
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasNonAlphanumeric,
      hasSpecialCharacters,
    ];

    if (
      cases.every((value) => {
        return value;
      })
    ) {
      return true;
    } else {
      throw new Error(
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
    }
  } else {
    throw new Error("Password must be at least 8 characters long.");
  }
};

const valid_email = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const valid_state = (state) => {
  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];
  return states.includes(state.toUpperCase());
};

const toExport = {
  valid_string,
  valid_username,
  valid_password,
  valid_email,
  valid_state,
};
export default toExport;
