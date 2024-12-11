import { Router } from "express";
const router = Router();
import usersData from "../data/users.js";
import { verifyPassword, verifyUsername } from "../helpers.js";

router
  .route("/")
  .get(
    (req, res, next) => {
      if (req.session.username) {
        res.redirect("/signin");
      }
      next();
    },
    async (req, res) => {
      return res.render("pages/signin");
    }
  )
  .post(
    (req, res, next) => {
      if (req.session.username) {
        return res
          .status(400)
          .json({ error: "sign in attempt while signed in" });
      }
    },
    async (req, res) => {
      let { username, password } = req.body;
      // set up to list all errors with signing in
      let errors = [];
      // verify username
      try {
        username = verifyUsername(username);
      } catch (e) {
        errors.push(e);
      }
      // verify password
      try {
        password = verifyPassword(password);
      } catch (e) {
        errors.push(e);
      }

      // if there are errors, render the page with the errors
      if (errors.length > 0) {
        return res.status(400).render("pages/signin", {
          errors,
        });
      }

      let userInfo;
      try {
        userInfo = await usersData.validateUserCredentials(username, password);
      } catch (e) {
        return res.status(400).render("signin", {
          errors: [e],
        });
      }

      req.session.userInfo = {
        username: userInfo.username,
        isAdmin: userInfo.isAdmin,
      };

      return res.redirect("/dashboard");
    }
  );

export default router;
