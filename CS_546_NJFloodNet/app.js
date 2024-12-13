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
import session from "express-session";

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};

// Middleware

// Middleware to make user session data available in views
const setUserInLocals = (req, res, next) => {
  res.locals.user = req.session.userInfo || null;
  next();
};

// TODO: maybe move this into another file?
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);
app.use("/public", express.static("public"));

app.use(
  session({
    name: "AuthenticationState",
    secret: "PatrickHill",
    resave: false,
    saveUninitialized: false,
  })
);

// Set res.locals.user for all views
app.use(setUserInLocals);

// View Engine
app.set("view engine", "ejs");

configRoutes(app);

app.listen(port, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${port}`);
});

