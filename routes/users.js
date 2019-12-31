var express = require("express");
var router = express.Router();
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require("../config/local_authen/authen");
/* GET home page.  */
router.get("/", ensureAuthenticated, function(req, res, next) {
  res.render("user", { title: "Express" });
  //view index
});

module.exports = router;
