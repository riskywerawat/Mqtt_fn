const passport = require("passport");
//ใช้ในการ decode jwt ออกมา
const ExtractJwt = require("passport-jwt").ExtractJwt;
//ใช้ในการประกาศ Strategy
const JwtStrategy = require("passport-jwt").Strategy;
const SECRET = "ILOVEYOU";
//สร้าง Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: SECRET
};
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
  // find username prority 2
  console.log(payload);

  var sql =
    "SELECT id,username,password,priority  FROM `accounts` WHERE `username`='" +
    payload.uname +
    "' and priority = 1";
  connection.query(sql, (err, result) => {
    console.log(result);
    try {
      if (err) {
        done(null, false);
      }
      if (result.length >= 1) {
        done(null, true);
      } else {
        done(null, false);
      }
    } catch (error) {
      done(null, false);
    }
  });
  // done(null, true);
  // else done(null, false);
});
//เสียบ Strategy เข้า Passport
passport.use("admin", jwtAuth);
//ทำ Passport Middleware
const adminmiddleware = passport.authenticate("admin", { session: false });

module.exports = adminmiddleware;
