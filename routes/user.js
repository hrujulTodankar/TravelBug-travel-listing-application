const express = require("express");
const passport = require("passport");
const router = express.Router({mergeParams : true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
//const bcrypt = require('bcrypt'); // used only as fallback check if needed

const userController = require("../controllers/users.js");

router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.Usersignup));

router.get("/login", userController.renderLoginForm);

router.post("/login",saveRedirectUrl, userController.loginForm);

router.get("/logout", userController.logoutUser);


module.exports = router;