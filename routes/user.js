const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const User = require("../models/user.js");

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.Usersignup));


router.get("/login", userController.renderLoginForm);
router.post("/login",saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome back!");
        const redirectUrl = "/listings";
        res.redirect(redirectUrl);
        delete res.locals.redirectUrl;
    }
);    
router.get("/logout", userController.logoutUser);

module.exports = router;