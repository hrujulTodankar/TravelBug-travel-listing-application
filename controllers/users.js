const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("listings/signup.ejs");
};

module.exports.Usersignup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to TravelBug");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        // We use return to stop execution so wrapAsync doesn't call next(e)
        return res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("listings/login.ejs");
};

// This function now only handles the redirect AFTER passport.authenticate runs
module.exports.loginForm = async (req, res) => {
console.log("--- DEBUG: Login Successful! Reached Controller ---");
    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};