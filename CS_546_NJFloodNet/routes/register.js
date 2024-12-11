import { Router } from "express";
const router = Router();
import usersData from "../data/users.js";
import { verifyPassword, verifyStr, verifyUsername } from "../helpers.js";

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
      return res.render("pages/register");
    }
  )
  .post(
    (req, res, next) => {
      if (req.session.userInfo) {
        return res
          .status(400)
          .json({ error: "sign up attempt while signed in" });
      }
    },
    async (req, res) => {
      let {
        username,
        email,
        city,
        state,
        firstName,
        lastName,
        password,
        passwordConf,
      } = req.body;
      // set up to list all errors with signing up
      let errors = [];
      // verify username
      try {
        username = verifyUsername(username);
      } catch (e) {
        errors.push(e);
      }
      // verify email
      try {
        email = verifyStr(email, `email`);
      } catch (e) {
        errors.push(e);
      }
      // verify city
      try {
        city = verifyStr(city, `city`);
      } catch (e) {
        errors.push(e);
      }
      // verify state
      try {
        state = verifyStr(state, `state`);
      } catch (e) {
        errors.push(e);
      }
      // verify firstName
      try {
        firstName = verifyStr(firstName, `firstName`);
      } catch (e) {
        errors.push(e);
      }
      // verify lastName
      try {
        lastName = verifyStr(lastName, `lastName`);
      } catch (e) {
        errors.push(e);
      }
      // verify password
      try {
        password = verifyPassword(password);
      } catch (e) {
        errors.push(e);
      }
      // verify passwordConf
      try {
        passwordConf = verifyStr(passwordConf, `passwordConf`);
      } catch (e) {
        errors.push(e);
      }
      if (password !== passwordConf) {
        errors.push(`Passwords must be the same`);
      }

      // if there are errors, render the page with the errors
      if (errors.length > 0) {
        return res.status(400).render("pages/register", {
          errors,
        });
      }

      let userInfo;
      try {
        // TODO: how to administer admin status?
        userInfo = await usersData.createUser(
          username,
          firstName,
          lastName,
          email,
          city,
          state,
          password,
          false
        );
      } catch (e) {
        return res.status(400).render("pages/register", {
          errors: [e],
        });
      }

      req.session.userInfo = {
        username: userInfo.username,
        isAdmin: userInfo.isAdmin,
      };

      return res.redirect("/signin");
    }
  );

export default router;
