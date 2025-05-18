const User = require("../models/user.js");

module.exports.getSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.postSignupPage = async(req, res) => {
    try{

        let {username, email, password} = req.body;
        const newUser = new User({email, username});

        const registed = await User.register(newUser, password);

        console.log(registed);

        req.login(registed, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to the WonderLust!")

            res.redirect("/listings");
        })
    
    } catch (e) {

        req.flash("error", e.message);
        res.redirect("/signup");

    }
    
};

module.exports.getLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.postLoginPage = async (req, res) => {
    req.flash("success", "Welcome back to WonderLust!");
    res.redirect(res.locals.redirectUrl || "/listings"); // ✅ fix here
};

module.exports.getLogout = (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged Out");
        res.redirect("/listings")
    });
}