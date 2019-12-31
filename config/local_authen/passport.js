const localStrategy = require("passport-local").Strategy;
const mysql = require("mysql");
const md5 = require("md5");
const connect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});
connect.connect(err => {
  if (err);
  console.log(err);
  console.log("connect my db for check passport");
});
const passport = require("passport");
const authenlocal = new localStrategy(
  {
    usernameField: "username"
  },
  (username, password, done) => {
    var sql =
      "SELECT id,username,password,priority  FROM `accounts` WHERE `username`='" +
      username +
      "'";
    connect.query(sql, (err, result) => {
      console.log(result);
      if (err) {
        return done(null, false);
      }
      if (result.length == 0) {
        return done(null, false, { message: "no user in database" });
        //m
      }
      if (md5(password) == result[0].password) {
        return done(null, result[0]);
      } else {
        return done(null, false);
      }
    });
  }
);
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
// used to deserialize the user
passport.deserializeUser(function(id, done) {
  connect.query("select * from accounts where id = " + id, function(
    err,
    result
  ) {
    console.log(result[0], "this is deserializeUser");
    done(err, result[0]);
  });
});

passport.use("local", authenlocal);

module.exports.localmidleware = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
});
