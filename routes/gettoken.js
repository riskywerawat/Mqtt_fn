const express = require("express");
const router = express.Router();
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});
var jwt = require("jwt-simple");
const SECRET = "ILOVEYOU";
var _ = require("underscore");
router.post("/", function(req, res, next) {
  const body = _.clone(req.body);
  console.log(body);
  if (body) {
    try {
      var sql =
        "SELECT id,username,password,priority  FROM `accounts` WHERE `username`='" +
        body.username +
        "' and password = '" +
        body.password.toString() +
        "'";
      connection.query(sql, (err, result) => {
        console.log(result);
        if (err) {
          throw err;
        }
        if (result.length > 0) {
          const payload = {
            uname: body.username
          };
          console.log(payload, "this is payload");
          res.json({
            status: true,
            message: "ok",
            token: jwt.encode(payload, SECRET),
            priority: result[0].priority
          });
        } else {
          res.json({ status: false, message: "username password is wrong" });
        }
      });
    } catch (error) {
      console.log(error);
      json({ status: false, mes: error.message });
    }
  }
});

module.exports = router;
