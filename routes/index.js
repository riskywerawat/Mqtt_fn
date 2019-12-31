var express = require("express");
var router = express.Router();
// var midlewareadmin = require('../authen/authen_admin');
/* GET home page. */
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require("../config/local_authen/authen");
router.get("/", ensureAuthenticated, function(req, res, next) {
  res.render("index", { title: "Express" }); //view index
});

module.exports = router;
