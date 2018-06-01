const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();
const path = require("path");
const hbs = require("express-handlebars");

//Routes
const users = require("./api/routes/users");
const profile = require("./api/routes/profile");
const posts = require("./api/routes/posts");

//Initialize app
const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Setting up view enginer for handlebars
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Database config with MLabs
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected."))
  .catch(err => console.log(err));

//Page routes
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

//Use Routes
app.use("/api/users", users);
//app.use("/api/profile", profile);
//app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
