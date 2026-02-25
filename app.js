if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


// app.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const passport  = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js"); 
const { saveRedirectUrl } = require("./middleware.js");
const { isLoggedIn } = require("./middleware.js");

const listingsroutes = require("./routes/listings.js"); // <-- make sure filename matches
const reviewsroutes = require("./routes/reviews.js");
const userroutes = require("./routes/user.js");


// Connect to MongoDB

mongoose.connection.on("connected", () => console.log("Mongoose connected to DB"));
mongoose.connection.on("error", (err) => console.log("Mongoose connection error:", err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travelBug');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.disable("view cache"); // Disable template caching for development
app.locals.cache = false; // Disable EJS template caching for development
app.use(express.urlencoded({ extended: true })); // this is responsible for parsing the form data and making it available in req.body
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
ejsMate.cache = false; // Disable ejsMate template caching
// Serve static files with no caching for development
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: 0,
  etag: false,
  lastModified: false
}));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); 
});

passport.use("local", User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.get("/debug/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      userCount: users.length,
      users: users.map(u => ({
        _id: u._id,
        username: u.username,
        email: u.email,
        hasHash: !!u.hash,
        hasSalt: !!u.salt
      }))
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.get("/debug/clear-users", async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({
      message: "All users deleted",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});



// Mount listing routes at /listings
app.use("/listings", listingsroutes);
app.use("/listings/:id/reviews", reviewsroutes);
app.use("/" , userroutes);

// 404 handler - catch unmatched routes
app.use((req, res, next) => {
  res.status(404).render("error.ejs", { message: "Page not found" });
});

// central error handler
app.use((err, req, res, next) => {
  console.log("Error handled:", err);
  if (res.headersSent) {
    return next(err);
  }
  const statuscode = err.statuscode || 500;
  const message = err.message || "Something went wrong";
  res.render("error.ejs", { message });
});

const PORT = 8080;
main().then(() => {
  console.log("connected to DB");
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
}).catch(err => console.log(err));
