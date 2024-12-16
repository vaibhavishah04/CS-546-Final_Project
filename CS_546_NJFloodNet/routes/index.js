import measurementsRoutes from "./measurements.js";
import sensorsRoutes from "./sensors.js";
import usersRoutes from "./users.js";
import signInRoutes from "./signin.js";
import dashboardRoutes from "./dashboard.js";
import signUpRoutes from "./signup.js";
import reportingRoutes from "./reporting.js";
import aboutRoutes from "./about.js";
import sensorData from "../data/sensors.js"; // Import your sensor data functions

const constructorMethod = (app) => {
  //User can not access reporting page withput sing in
  const isAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.userInfo) {
      return res.redirect("/signin");
    }
    next();
  };

  app.get("/", async (req, res) => {
    try {
      const sensors = await sensorData.getAllSensors();

      // Update the image path for each sensor
      const sanitizedSensors = sensors.map((sensor) => ({
        ...sensor,
        image: sensor.image.startsWith("./")
          ? `../public${sensor.image.slice(1)}` // Replace "./" with "../public/"
          : sensor.image, // Leave absolute paths untouched
      }));

      //console.log("Sanitized sensors with updated image paths:", sanitizedSensors); // Debugging
      res.render("pages/map", { sensors: sanitizedSensors });
    } catch (e) {
      console.error("Error fetching sensors for map:", e);
      res.status(500).send("Error loading the map page.");
    }
  });

  app.use("/signin", signInRoutes);
  app.use("/signup", signUpRoutes);
  app.use("/measurements", measurementsRoutes);
  app.use("/sensors", sensorsRoutes);
  app.use("/users", usersRoutes);
  app.use("/dashboard", dashboardRoutes);
  app.use("/about", aboutRoutes);

  app.use(isAuthenticated);
  app.use("/reporting", reportingRoutes);

  app.use("*", (req, res) => {
    return res.status(404).render("pages/error");
  });
};

export default constructorMethod;
