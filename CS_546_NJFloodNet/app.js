import express from "express";
import configRoutes from "./routes/index.js";
import session from "express-session";
//import axios from 'axios'; -- added for api translation
import path from 'path';
import i18n from "i18n";
const port = 3000;
const app = express();



//local transalation code 

i18n.configure({
  locales: ["en", "es"], // Supported languages: English and Spanish
  directory: path.join(path.resolve(), "locales"), // Directory for translation files
  defaultLocale: "en",
  queryParameter: "lang", // URL query parameter to switch language (?lang=en or ?lang=es)
  autoReload: true,
  syncFiles: true,
});
app.use(i18n.init);
app.use((req,res,next)=>{
  const lang = req.query.lang || "en";
  req.setLocale(lang);
  res.locals.currentlanguage = lang;
  res.locals.__ =res.__;
  next();
})

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


/*
//API translation code
app.get("/translate", async (req, res) => {
  const { text = "Hello, World!", lang = "es" } = req.query;
  if (!text || !lang) {
    return res.status(400).json({ error: "Missing text or language" });
  }

  try {
    const response = await axios.post("https://libretranslate.de/translate", {
      q: text,          // Text to translate
      source: "en",     // Source language (English)
      target: lang,     // Target language (default: Spanish)
      format: "text",   // Text format
      api_key: ""
    });

    res.json({
      original: text,
      translated: response.data.translatedText,
    });
  } catch (error) {
    console.error("Translation Error:", error.message);
    res.status(500).json({ error: "Not able to translate text" });
  }
});
*/

configRoutes(app);

app.listen(port, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${port}`);
});
