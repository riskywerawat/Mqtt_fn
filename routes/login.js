var express = require("express");
var router = express.Router();

const {
  ensureAuthenticated,
  forwardAuthenticated
} = require("../config/local_authen/authen");
router.get("/", forwardAuthenticated, function(req, res, next) {
  res.render("login", { title: "Express" });
  //view index
});

module.exports = router;
