const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async(req, res) => {
    try{
        let {username, email, password} = req.body;
    const newUser = new User({email, username});

    const registed = await User.register(newUser, password);

    console.log(registed);

    req.flash("success", "Welcome to the WonderLust!")

    res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
}));


router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login",
     passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), 
     wrapAsync(async(req, res) => {
    
        req.flash("success", "Welcome back to the WonderLust!")
        res.redirect("/listings")
}));


router.get("/logout", (req, res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged Out");
        res.redirect("/listings")
    });
});

module.exports = router;