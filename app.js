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
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 
const { saveRedirectUrl } = require("./middleware.js");
const { isLoggedIn } = require("./middleware.js");

const listingsroutes = require("./routes/listings.js"); // <-- make sure filename matches
const reviewsroutes = require("./routes/reviews.js");
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
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
  },
};

// 1. Session Config
app.use(session(sessionOptions));

// 2. Flash Config
 app.use(flash());

// 3. Passport Config (MUST come after session)
app.use(passport.initialize());
app.use(passport.session());

// 4. Global Locals (MUST come after passport.session)
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    console.log("--- DEBUG: Global middleware passing to next ---");
    next(); // <--- Without this, EVERY route in your app will hang
});

// app.js

// 1. Link the strategy to your User model's built-in authentication method
passport.use(new LocalStrategy(User.authenticate())); 

// 2. Tell Passport how to store the user in the session
passport.serializeUser(User.serializeUser());   

// 3. Tell Passport how to retrieve the user from the session
passport.deserializeUser(User.deserializeUser());

// convenience root
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

// // Optional: convenience redirect for someone visiting /new
// app.get("/new",isLoggedIn, (req, res) => {
//   return res.redirect(res.locals.redirectUrl || "/listings/new");
// });

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
