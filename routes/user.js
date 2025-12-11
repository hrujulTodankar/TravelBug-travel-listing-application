const express = require("express");
const passport = require("passport");
const router = express.Router({mergeParams : true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
//const bcrypt = require('bcrypt'); // used only as fallback check if needed


router.get("/signup", (req, res) => {
  res.render("listings/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
 try{
   let { username, email, password } = req.body;
    const newUser = new User({ username, email }); 
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success", "Welcome to TravelBug");
    res.redirect("/listings");
 }
 catch(e){
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}
));

router.get("/login", (req, res) => {
  res.render("listings/login.ejs");
}); 

router.post("/login", async (req, res) => {
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
          return res.redirect("/listings");
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
});






module.exports = router;