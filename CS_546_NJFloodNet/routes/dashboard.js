import { Router } from "express";
const router = Router();

router.route("/").get(
  (req, res, next) => {
    next();
  },
  async (req, res) => {
    return res.render("pages/dashboard");
  }
);

export default router;
