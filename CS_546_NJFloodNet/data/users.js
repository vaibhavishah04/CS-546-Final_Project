import bcrypt from "bcryptjs";
import { users } from "../config/mongoCollections.js";
import userVal from "../validation/user_val.js";

/**
 * Manage user-related database operations.
 * Includes user creation, signin validation, and admin checks.
 */

// Create a new user with hashed password
// Hash the password before storing it in the database

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

const createUser = async (
  username,
  firstName,
  lastName,
  email,
  city,
  state,
  password,
  isAdmin
) => {
  try {
    let usernameOk = userVal.valid_username(username);
    let firstNameOk = userVal.valid_string(firstName);
    let lastNameOk = userVal.valid_string(lastName);
    let emailOk = userVal.valid_email(email);
    let cityOk = userVal.valid_string(city);
    let stateOk = userVal.valid_state(state);
    let passwordOk = userVal.valid_password(password);
    let isAdminOk = typeof isAdmin === "boolean";
    let paramCheck =
      usernameOk &&
      firstNameOk &&
      lastNameOk &&
      emailOk &&
      cityOk &&
      stateOk &&
      passwordOk &&
      isAdminOk;
    if (!paramCheck) throw new Error("Invalid parameters");
  } catch (e) {
    throw new Error("Invalid input: " + e.message);
  }

  // Check if the user already exists
  try {
    const userData = await users();
    const existingUser = await userData.findOne({ username });
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Create a new user document
    const newUser = {
      username,
      firstName,
      lastName,
      email,
      city,
      state,
      password: hashPassword(password),
      isAdmin,
    };
    await userData.insertOne(newUser);
    return newUser;
  } catch (e) {
    throw new Error("Error creating user: " + e.message);
  }
};

// Validate user login credentials
const validateUserCredentials = async (username, password) => {
  // Validate inputs
  let usernameOk = userVal.valid_username(username);
  let passwordOk = userVal.valid_password(password);
  if (!usernameOk || !passwordOk)
    throw new Error("Invalid username or password");

  // Fetch the user document from the database
  const userData = await users();
  const user = await userData.findOne({ username });
  if (!user) throw new Error("User not found");

  // Compare the provided password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error("Invalid username or password");

  // User credentials are valid, return the user document
  return {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin || false,
  };
};

// Check if the user has admin privileges
const isAdmin = async (username) => {
  // Fetch the user document from the database
  const userData = await users();
  const user = await userData.findOne({ _id: new ObjectId(username) });
  if (!user) throw new Error("User not found");

  // Return isAdmin field
  return user.isAdmin;
};

// Retrieve a user by their ID
const getUserById = async (username) => {
  // Fetch the user document from the database
  const userData = await users();
  const user = await userData.findOne({ _id: new ObjectId(username) });
  if (!user) throw new Error("User not found");

  // Return the user document
  return user;
};

// Update user information
const updateUser = async (username, updateData) => {
  // Fetch the user document from the database
  const userData = await users();
  let user = await userData.findOne({ _id: new ObjectId(username) });
  const uid = user._id.toString();

  // Check if the user exists
  if (!user) throw new Error("User not found");

  // Update the user data with the provided information
  for (const key in updateData) {
    user[key] = updateData[key];
  }

  // Save the updated user document to the database
  userData.updateOne({ _id: uid }, { $set: user });
  return user;
};

// Delete a user
const deleteUser = async (username) => {
  // Fetch the user document from the database
  const userData = await users();
  const user = await userData.findOne({ _id: new ObjectId(username) });
  if (!user) throw new Error("User not found");

  // Delete the user document from the database
  return userData.deleteOne({ _id: username });
};

export default {
  createUser,
  validateUserCredentials,
  isAdmin,
  getUserById,
  updateUser,
  deleteUser,
};
