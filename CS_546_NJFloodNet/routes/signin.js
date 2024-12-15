import { Router } from "express";
const router = Router();
import usersData from "../data/users.js";
import validation from "../validation.js";

router
  .route("/")
  .get(
    (req, res, next) => {
      if (req.session.userInfo) {
        return res.redirect("/dashboard");
      }
      next();
    },
    async (req, res) => {
      return res.render("pages/signin");
    }
  )
  .post(
    (req, res, next) => {
      if (req.session.userInfo) {
        console.error("Sign in attempt while already signed in.");
        return res
          .status(400)
          .json({ error: "Sign in attempt while already signed in" });
      }
      next();
    },
    async (req, res) => {
      //console.log("Received Sign In form data:", req.body); // Log incoming data

      let { username, password } = req.body;
      let errors = [];

      // Validate username
      try {
        username = validation.verifyUsername(username);
      } catch (e) {
        console.error("Username validation error:", e.message || e);
        errors.push(e.message || e);
      }

      // Validate password
      try {
        password = validation.verifyPassword(password);
      } catch (e) {
        console.error("Password validation error:", e.message || e);
        errors.push(e.message || e);
      }

      // If there are validation errors
      if (errors.length > 0) {
        console.error("Validation errors:", errors);
        return res.status(400).render("pages/signin", {
          errors,
        });
      }

      let userInfo;
      try {
        console.log("Validating user credentials...");
        userInfo = await usersData.validateUserCredentials(username, password);
        console.log("User credentials validated:", userInfo);
      } catch (e) {
        console.error("Error validating user credentials:", e.message || e);
        return res.status(400).render("pages/signin", {
          errors: [e.message || e],
        });
      }

      // Set session and redirect to dashboard
      req.session.userInfo = {
        username: userInfo.username,
        isAdmin: userInfo.isAdmin,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        emailSubscription: userInfo.emailSubscription || false, // Include emailSubscription
      };
      return res.redirect("/");
    }
  );

export default router;
