const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("listings/signup.ejs");
};

module.exports.Usersignup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to TravelBug!");
            req.session.save(() => {
                res.redirect("/listings");
            });
        });
    } catch (e) {
        console.error("Signup error:", e.message);
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("listings/login.ejs");
};

module.exports.loginForm = async (req, res) => {
    req.flash("success", "Welcome back to TravelBug!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    
    // Clear the redirectUrl from session so it doesn't persist for future logins
    if (req.session.redirectUrl) {
        delete req.session.redirectUrl;
    }

    req.session.save(() => {
        res.redirect(redirectUrl);
    });
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};