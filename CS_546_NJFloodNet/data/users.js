import bcrypt from "bcryptjs";
import { users } from "../config/mongoCollections.js";
import userVal from "../validation/user_val.js";
import { ObjectId } from "mongodb";
import validation from "../validation.js";

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
  isAdmin,
  emailSubscription = false // Add email subscription field
) => {
  let usernameOk = userVal.valid_username(username);
  // TODO: make a verifyFirstName function
  firstName = validation.verifyStr(firstName, `firstName`);
  // TODO: make a verifyLastName function
  lastName = validation.verifyStr(lastName, `lastName`);
  let emailOk = userVal.valid_email(email);
  city = validation.verifyStr(city, `city`);
  let stateOk = userVal.valid_state(state);
  let passwordOk = userVal.valid_password(password);
  let isAdminOk = typeof isAdmin === "boolean";
  let emailSubscriptionOk = typeof emailSubscription === "boolean";
  let paramCheck =
    usernameOk &&
    firstNameOk &&
    lastNameOk &&
    emailOk &&
    cityOk &&
    stateOk &&
    passwordOk &&
    isAdminOk &&
    emailSubscriptionOk;
  if (!paramCheck) throw new Error("Invalid parameters");

  try {
    const userData = await users();
    const existingUser = await userData.findOne({ username });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser = {
      username,
      firstName,
      lastName,
      email,
      city,
      state,
      password: hashPassword(password),
      isAdmin,
      emailSubscription, // Include email subscription
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
    emailSubscription: user.emailSubscription || false, // Include emailSubscription
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
  const userData = await users();

  // Determine whether to query by username or _id
  const query = ObjectId.isValid(username) // Check if `username` is a valid ObjectId
    ? { _id: new ObjectId(username) } // If valid ObjectId, query by _id
    : { username }; // Otherwise, query by username

  // Fetch the user document from the database
  const user = await userData.findOne(query);
  if (!user) throw new Error("User not found");

  // Update the user data with the provided information
  await userData.updateOne(query, { $set: updateData });

  // Return the updated user document
  return { ...user, ...updateData }; // Merge updated data into original user object
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
