/**
 * users.js (Routes)
 *
 * Tasks:
 * 1. Define routes for user-related actions.
 * 2. Connect endpoints to functions in data/users.js.
 *
 * Endpoints:
 * - POST /register: Register a new user.
 * - POST /login: Log in an existing user.
 * - GET /profile: Retrieve user profile data.
 */
// Register a new user
// function registerUser(req, res) {}

// Log in an existing user
// function loginUser(req, res) {}

// Retrieve the profile of the logged-in user
// function getUserProfile(req, res) {}

// Update user information
// function updateUserProfile(req, res) {}

// Delete a user account
// function deleteUserAccount(req, res) {}

import { Router } from "express";
const router = Router();
// TODO: Data functions
// import { getMovieById, searchMoviesByTitle } from "../data/movies.js";
// TODO: Make helper file?
// import { verifyStr } from "../helpers.js";

router.route("/register").post(async (req, res) => {
  // POST ENDPOINT
});

router.route("/login").post(async (req, res) => {
  // POST ENDPOINT
});

router.route("/profile").post(async (req, res) => {
  // GET ENDPOINT
});

export default router;