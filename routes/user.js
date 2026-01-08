const express = require("express");
const passport = require("passport");
const router = express.Router({mergeParams : true});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
//const bcrypt = require('bcrypt'); // used only as fallback check if needed

const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.Usersignup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, userController.loginForm);

router.get("/logout", userController.logoutUser);


module.exports = router;