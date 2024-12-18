import { Router } from "express";
import usersData from "../data/users.js";
import validation from "../validation.js";
import xss from "xss";
const router = Router();

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
      return res.render("pages/signup");
    }
  )
  .post(
    (req, res, next) => {
      if (req.session.userInfo) {
        console.error("User is already signed in.");
        return res
          .status(400)
          .json({ error: "Sign-up attempt while signed in" });
      }
      next();
    },
    async (req, res) => {
      //console.log("Received form data:", req.body);

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

      username = xss(username);
      email = xss(email);
      city = xss(city);
      state = xss(state);
      firstName = xss(firstName);
      lastName = xss(lastName);
      password = xss(password);
      passwordConf = xss(passwordConf);

      let errors = [];

      // Validation steps with logging
      try {
        username = validation.verifyUsername(username);
      } catch (e) {
        // console.error("Username validation error:", e.message || e);
        errors.push(e.message);
      }
      try {
        email = validation.verifyStr(email, `email`);
      } catch (e) {
        // console.error("Email validation error:", e.message || e);
        errors.push(e.message);
      }
      try {
        city = validation.verifyStr(city, `city`);
      } catch (e) {
        // console.error("City validation error:", e.message || e);
        errors.push(e.message);
      }
      try {
        state = validation.verifyStr(state, `state`);
      } catch (e) {
        // console.error("State validation error:", e.message || e);
        errors.push(e.message);
      }
      try {
        firstName = validation.verifyStr(firstName, `firstName`);
      } catch (e) {
        // console.error("First name validation error:", e.message || e);
        errors.push(e.message);
      }
      try {
        lastName = validation.verifyStr(lastName, `lastName`);
      } catch (e) {
        // console.error("Last name validation error:", e.message || e);
        errors.push(e.message);
      }
      try {
        password = validation.verifyPassword(password);
      } catch (e) {
        // console.error("Password validation error:", e.message || e);
        // console.trace(); // Add this to log the stack trace
        errors.push(e.message);
      }
      if (password !== passwordConf) {
        // console.error("Password mismatch error.");
        errors.push("Passwords must be the same");
      }

      if (errors.length > 0) {
        // console.error("Validation errors:", errors);
        return res.status(400).render("pages/signup", {
          errors,
          formData: {
            username,
            email,
            city,
            state,
            firstName,
            lastName,
            password,
            passwordConf,
          },
        });
      }

      let userInfo;
      try {
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
        console.log("User created successfully:", userInfo);
      } catch (e) {
        // console.error("Error creating user:", e.message || e);
        return res.status(400).render("pages/signup", {
          errors: [e.message],
          formData: {
            username,
            email,
            city,
            state,
            firstName,
            lastName,
            password,
            passwordConf,
          },
        });
      }

      // User is not verified here, should have no cookies here
      // req.session.userInfo = {
      //   username: userInfo.username,
      //   isAdmin: userInfo.isAdmin,
      //   firstName: userInfo.firstName,
      //   lastName: userInfo.lastName,
      //   email: userInfo.email,
      // };

      return res.redirect("/signin");
    }
  );

export default router;
