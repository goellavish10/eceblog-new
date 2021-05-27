const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");
const compression = require("compression");

// Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: "800kb" }));
app.use(express.urlencoded({ extended: false, limit: "800kb" }));

// Compression middleware
app.use(
  compression({
    level: 7,
    threshold: 0,
  })
);

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  deleteComment,
  select,
  checkingCurrentPagePublic,
  checkingCurrentPage,
} = require("./helpers/hbs");
const { publicDecrypt } = require("crypto");

// Handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      deleteComment,
      select,
      checkingCurrentPagePublic,
      checkingCurrentPage,
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, "public")));

/* Routes  */
// Public Routes
app.use("/", require("./routes/public routes/homepage"));
app.use("/publicStories", require("./routes/public routes/pstories"));
app.use("/singleUser", require("./routes/public routes/pUserStories"));
// Authenticated Routes
app.use("/login", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));
app.use("/do-comment", require("./routes/public routes/pstories"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
