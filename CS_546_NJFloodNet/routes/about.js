import { Router } from "express";
const router = Router();

// Route to render the About page
router.get("/", (req, res) => {
  res.render("pages/about");
});

export default router;
