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


router.post("/login", saveRedirectUrl, async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log("--- DEBUG: Manual Check for User ---");
        const foundUser = await User.findOne({ username });
        
        if (!foundUser) {
            console.warn("--- DEBUG: User not found in DB ---");
            req.flash("error", "User not found");
            return res.redirect("/login");
        }

        // Directly test the model's authentication
        const { user, error } = await foundUser.authenticate(password);
        if (error || !user) {
            console.warn("--- DEBUG: Authentication failed check ---", error ? error.message : "Wrong password");
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }

        console.log("--- DEBUG: Model check passed, starting req.login ---");
        req.login(user, (err) => {
            if (err) return next(err);
            console.log("--- DEBUG: LOGIN SUCCESSFUL! ---");
            req.flash("success", "Welcome back!");
            return res.redirect("/listings");
        });
    } catch (e) {
        console.error("--- DEBUG: CRITICAL ERROR ---", e);
        next(e);
    }
});

router.get("/login", userController.renderLoginForm);
router.post("/login", userController.loginForm);    
router.get("/logout", userController.logoutUser);

module.exports = router;