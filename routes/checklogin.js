const express = require("express");
const router = express.Router();
var mysql = require("mysql");
const passport = require("passport");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});
const { localmidleware } = require("../config/local_authen/passport");
var jwt = require("jwt-simple");
const SECRET = "ILOVEYOU";
var _ = require("underscore");

router.post("/", localmidleware, (req, res) => {
  console.log(req.user.priority, "hello");
  if (req.user.priority == 1) {
    res.redirect("/index");
  } else {
    res.redirect("/users");
  }
});

module.exports = router;
