const router = require("express").Router();
const User = require("../models/user.model");
const passport = require("../config/passportConfig");
const isLoggedIn = require("../config/loginBlocker");
const { check, validationResult } = require('express-validator');

router.get("/auth/signup", (request, response) => {
  response.render("auth/signup");
});

router.get("/auth/signin", (request, response) => {
  response.render("auth/signin");
});

router.post("/auth/signup", [
      check('name').isLength({ min: 3 }),
      check('phone').isLength({ min: 3 }),
      check('email').isEmail(),
      check('password').isLength({ min: 6 })
  ],
  (request, response) => {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
          request.flash("autherror", errors.errors)
          return response.redirect("/auth/signup");
      }
      let user = new User(request.body);
      user.save()
          .then(() => {
              // response.redirect("/home");
              passport.authenticate("local", {
                  successRedirect: "/home",
                  successFlash: "Account created and Logged In!"
              })(request, response);
          })
          .catch(err => {
              console.log(err);
              request.flash("error", "Email already exists!");
              return response.redirect("/auth/signup");
          });
  }
);

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
