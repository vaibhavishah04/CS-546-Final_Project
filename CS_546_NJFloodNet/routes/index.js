import measurementsRoutes from "./measurements.js";
import sensorsRoutes from "./sensors.js";
import usersRoutes from "./users.js";
import signInRoutes from "./signin.js";
import dashboardRoutes from "./dashboard.js";

const constructorMethod = (app) => {
  app.get("/", (req, res) => {
    // TODO: Decide if our home page is going to be the map
    return res.render("pages/map");
  });

  app.use("/signin", signInRoutes);
  app.use("/measurements", measurementsRoutes);
  app.use("/sensors", sensorsRoutes);
  app.use("/user", usersRoutes);
  app.use("/dashboard", dashboardRoutes);

  app.use("*", (req, res) => {
    // TODO: Decide if we want to make a 404 page, my (Thys) vote is yes
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
