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
import userData from "../data/users.js";
import { Router } from "express";
const router = Router();
// TODO: Data functions
// import { getMovieById, searchMoviesByTitle } from "../data/movies.js";
// TODO: Make helper file?

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

router.route("/profile/subscription").post(async (req, res) => {
  try {
    const emailSubscription = req.body.emailSubscription === "on"; // Checkbox returns "on" if checked
    const username = req.session.userInfo.username;

    username = xss(username);

    // Update user in the database
    const updatedUser = await userData.updateUser(username, {
      emailSubscription,
    });

    // Update session
    req.session.userInfo.emailSubscription = emailSubscription;

    return res.render("pages/profile", { userInfo: req.session.userInfo });
  } catch (e) {
    console.error("Error updating profile:", e.message || e);
    return res.status(500).send("Internal Server Error");
  }
});

// Route to handle logout
router.route("/profile").post(async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error logging out:", err);
        return res.status(500).send("Internal Server Error");
      }
      return res.redirect("/");
    });
  } catch (e) {
    console.error("Error in logout route:", e.message || e);
    return res.status(500).send("Internal Server Error");
  }
});

export default router;
