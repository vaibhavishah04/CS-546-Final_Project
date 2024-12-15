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
        // If a user tries to sign in while signed in, redirect them to their profile
        return res.redirect("/users/profile");
      }
      next();
    },
    async (req, res) => {
      let { username, password } = req.body;

      // Validate user. If anything fails, simply rerender the page with a 400 error and error messages
      let userInfo;
      try {
        username = validation.verifyUsername(username);
        password = validation.verifyPassword(password);
        userInfo = await usersData.validateUserCredentials(username, password);
      } catch (e) {
        return res.status(400).render("pages/signin", {
          errors: ["Username and password do not match"],
          formData: {
            username,
            password,
          },
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
