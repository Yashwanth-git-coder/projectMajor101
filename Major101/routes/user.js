const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const usersController = require("../controllers/users.js");

router.get("/signup", usersController.getSignupForm);

router.post("/signup", wrapAsync(usersController.postSignupPage));


router.get("/login", usersController.getLoginForm);


router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true
    }),
    usersController.postLoginPage
);
  


router.get("/logout", usersController.getLogout);

module.exports = router;