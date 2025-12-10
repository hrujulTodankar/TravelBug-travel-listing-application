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

// router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), 
// async(req, res) => {
//    await req.flash("success", "Welcome back!");
//    res.send("Welcome back!");
// });

// routes/auth.js (or listings router where login lives)

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', info?.message || 'Login failed');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});


module.exports = router;