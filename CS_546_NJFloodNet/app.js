import express from "express";
import configRoutes from "./routes/index.js";
import session from "express-session";
const port = 3000;
const app = express();

// Middleware definitions
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
