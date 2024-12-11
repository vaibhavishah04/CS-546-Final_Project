import { Router } from "express";
const router = Router();

router
  .route("/")
  .get(async (req, res) => {
    return res.render("pages/signin");
  })
  .post(async (req, res) => {
    let { userId, password } = req.body;
    // set up to list all errors with signing in
    let errors = [];
    // verify userId
    try {
      userId = verifyUserId(userId);
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
      userInfo = await signInUser(userId, password);
    } catch (e) {
      return res.status(400).render("signin", {
        errors: [e],
      });
    }

    req.session.userInfo = userInfo;

    return res.redirect("/dashboard");
  });

export default router;
