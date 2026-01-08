const Listing = require("../models/listing.js");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");

module.exports.renderSignupForm =  (req, res) => {
  res.render("listings/signup.ejs");
}

module.exports.Usersignup =async (req, res) => {
 try{
   let { username, email, password } = req.body;
    const newUser = new User({ username, email }); 
    const registeredUser = await User.register(newUser,password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to TravelBug");
      res.redirect("/listings");
    });
 }
 catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}

module.exports.renderLoginForm = (req, res) => {
  res.render("listings/login.ejs");
}

module.exports.loginForm = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    
    if (user) {
      const authResult = await user.authenticate(password);
      if (authResult.user) {
        req.login(user, (err) => {
          if (err) {
            console.error("Login error:", err);
            req.flash("error", "Login failed");
            return res.redirect("/login");
          }
          req.flash("success", "Welcome back!");
          let redirectUrl = res.locals.redirectUrl || "/listings";
          return res.redirect(redirectUrl);
        });
      } else {
        req.flash("error", "Invalid username or password");
        return res.redirect("/login");
      }
    } else {
      req.flash("error", "Invalid username or password");
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "Login error");
    return res.redirect("/login");
  }
}

module.exports.logoutUser = (req, res , next) => {
  req.logout((err) => {
    if (err) {  
      return next(err);
      return res.redirect("/listings");
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
}