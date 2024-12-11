/**
 * Manage user-related database operations.
 * Includes user creation, signin validation, and admin checks.
 */
import { verifyUserId, verifyPassword } from "../helpers";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";

// Create a new user with hashed password
function createUser(userData) {}

// Validate user signIn credentials
export const validateUserCredentials = async (userId, password) => {
  // verify userId
  userId = verifyUserId(userId);
  // verify password
  password = verifyPassword(password);
  // get the user obj from db
  const usersCollection = await users();
  const user = await usersCollection.findOne({ userId });
  if (!user) throw new Error(`Either the userId or password is invalid`);
  // use bcrypt to check if the password is valid
  let verified = false;
  try {
    verified = await bcrypt.compare(password, user.hash);
  } catch (e) {
    // no op
  }

  if (!verified) throw new Error(`Either the userId or password is invalid`);

  let { username, isAdmin } = user;

  // TODO: This needs to return whatever we want to put in cookies
  return { username, isAdmin };
};

// Check if the user has admin privileges
function isAdmin(userId) {}

// Retrieve a user by their ID
function getUserById(userId) {}

// Update user information
function updateUser(userId, updateData) {}

// Delete a user
function deleteUser(userId) {}
