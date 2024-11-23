/**
 * Initialize the Express application.
 * Configure middlewares (body-parser, cors).
 * Connect routes from the `routes/` folder.
 * Add error handling and a 404 fallback route.
 */

// Initialize and configure the Express application
// function initializeExpressApp() {}

// Add middleware configurations
// function configureMiddlewares(app) {}

// Connect API routes to the application
// function connectRoutes(app) {}

// Handle 404 errors
// function handle404(app) {}

// Global error handler
// function handleErrors(app) {}

const port = 3000;

import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};

// Middleware
// TODO: maybe move this into another file?
app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

// Example of how to create handlebars helper function:
// var hbs = exphbs.create({
//   defaultLayout: "main",
//   helpers: {
//     isNA: (value) => {
//       return value === "N/A";
//     },
//     hbsEq: (v1, v2) => {
//       return v1 == v2;
//     },
//   },
// });

// This "main" needs to match whatever our default layout name is
var hbs = exphbs.create({ defaultLayout: "main" });

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(port, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${port}`);
});
