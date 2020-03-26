const router = require("express").Router();
const User = require("../models/user.model");
const passport = require("../config/passportConfig");
const isLoggedIn = require("../config/loginBlocker");
const { check, validationResult } = require('express-validator');


router.get("/auth/signup", (request, response) => {
  response.render("auth/signup");
});

router.post("/auth/signup", (request, response) => {
  let user = new User(request.body);
  user
    .save()
    .then(() => {
      //()()()()
      // response.redirect("/home");
      //user login after registration
      passport.authenticate("local", {
        successRedirect: "/home",
        successFlash: "Account created and You have logged In!"
      })(request, response);
    })
    .catch(err => {
      // console.log(err);
      if (err.code == 11000) {
        console.log("phone number Exists");
        request.flash("error", "Phone number Exists");
        return response.redirect("/auth/signup");
      }
      response.send("error!!!");
    });
});

router.get("/auth/signin", (request, response) => {
  response.render("auth/signin");
});

router.get("/home", isLoggedIn, (request, response) => {
  // request.user
  User.find().then(users => {
    response.render("home", { users });
  });
});

//-- Login Route
router.post(
  "/auth/signin",
  passport.authenticate("local", {
      successRedirect: "/home", //after login success
      failureRedirect: "/auth/signin", //if fail
      failureFlash: "Invalid Username or Password",
      successFlash: "You have logged In!"
  })
);

//--- Logout Route
router.get("/auth/logout", (request, response) => {
  request.logout(); //clear and break session
  request.flash("success", "Dont leave please come back!");
  response.redirect("/auth/signin");
});

module.exports = router;
