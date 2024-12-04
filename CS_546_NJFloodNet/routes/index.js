import measurementsRoutes from "./measurements.js";
import sensorsRoutes from "./sensors.js";
import usersRoutes from "./users.js";

const constructorMethod = (app) => {
  app.get("/", (req, res) => {
    // TODO: Decide if our home page is going to be the map
    return res.render("pages/map");
  });

  app.get(
    "/login",
    (req, res, next) => {
      // if the user is logged in, direct them to their account page
      // need to put this in a separate function
    },
    (req, res) => {
      return res.render("pages/login");
    }
  );

  app.use("/measurements", measurementsRoutes);
  app.use("/sensors", sensorsRoutes);
  app.use("/user", usersRoutes);

  app.use("*", (req, res) => {
    // TODO: Decide if we want to make a 404 page, my (Thys) vote is yes
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
