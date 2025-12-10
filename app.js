// app.js
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listings = require("./routes/listings.js"); // <-- make sure filename matches
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const passport  = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 


const listingsroutes = require("./routes/listings.js"); // <-- make sure filename matches
const reviewsroutes = require("./routes/review.js");
const userroutes = require("./routes/user.js");



// Connect to MongoDB
main().then(() => {
  console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travelBug');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());   
passport.use(new LocalStrategy(User.authenticate())); // Use User model for authentication
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());   


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // you can also add res.locals.currentUser = req.user if using passport
  next();
});

// convenience root
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// Optional: convenience redirect for someone visiting /new
app.get("/new", (req, res) => {
  return res.redirect("/listings/new");
});


// Mount listing routes at /listings
app.use("/listings", listingsroutes);
app.use("/listings/:id/reviews", reviewsroutes);
app.use("/" , userroutes);

// 404 handler - catch unmatched routes
app.all("{*path}", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// central error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const statuscode = err.statuscode || 500;
  const message = err.message || "Something went wrong";
  res.render("error.ejs", { message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
