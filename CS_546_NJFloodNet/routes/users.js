/**
 * users.js (Routes)
 *
 * Tasks:
 * 1. Define routes for user-related actions.
 * 2. Connect endpoints to functions in data/users.js.
 *
 * Endpoints:
 * - POST /register: Register a new user.
 * - POST /signin: Sign in an existing user.
 * - GET /profile: Retrieve user profile data.
 */
// Register a new user
// function registerUser(req, res) {}

// Sign in an existing user
// function signInUser(req, res) {}

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

router.route("/profile").get(
  (req, res, next) => {
    // TODO: if not signed in, redirect to signin page
    if (!req.session.userInfo) {
      return res.redirect("/signin");
    }
    next();
  },
  async (req, res) => {
    let userInfo = req.session.userInfo;

    return res.render("pages/profile", { userInfo });
  }
);

export default router;
