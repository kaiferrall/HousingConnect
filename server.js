const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router = express.Router();
const path = require("path");
const hbs = require("express-handlebars");
const keys = require("./config/keys");

//Authentication packages
const session = require("express-session");
const passport = require("passport");

//Database config with MLabs
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected."))
  .catch(err => console.log(err));

//Routes
const users = require("./api/routes/users");
const profile = require("./api/routes/profile");
const posts = require("./api/routes/posts");

//Initialize app
const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Setting up view engine for handlebars
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Cookie parser
app.use(cookieParser());

//Connect mongo session store
const MongoStore = require("connect-mongo")(session);

//Express-sessions Middleware
app.use(
  session({
    secret: keys.SESSION_KEY,
    resave: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: false,
    cookie: { maxAge: 3600 * 1000 }
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Storing Authentication status in the request's local login variable
app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  //console.log(res.locals.session);
  //console.log(res.locals.login);
  next();
});

//Page routes
app.get("/", (req, res) => {
  //console.log(req.user);
  console.log(req.isAuthenticated());
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/profile", authCheck(), (req, res) => {
  res.render("profileNone");
});
app.get("/find", (req, res) => {
  res.render("find");
});

//Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
//app.use("/api/posts", posts);

//authCheck function
function authCheck() {
  return (req, res, next) => {
    function authCheck() {
      return (req, res, next) => {
        console.log(
          `req.session.passport.user: ${JSON.stringify(req.session.passport)}`
        );

        if (req.isAuthenticated()) return next();

        res.redirect("/login");
      };
    }

    if (req.isAuthenticated()) return next();

    res.redirect("/login");
  };
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
