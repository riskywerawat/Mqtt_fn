const passport = require("passport");
//ใช้ในการ decode jwt ออกมา
const ExtractJwt = require("passport-jwt").ExtractJwt;
//ใช้ในการประกาศ Strategy
const JwtStrategy = require("passport-jwt").Strategy;
const SECRET = "ILOVEYOU";
//สร้าง Strategy
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: SECRET
};
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
  // find username prority 2
  console.log(payload);

  var sql =
    "SELECT id,username,password,priority  FROM `accounts` WHERE `username`='" +
    payload.uname +
    "' and priority = 2";
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
});
//เสียบ Strategy เข้า Passport
passport.use(jwtAuth);
//ทำ Passport Middleware
const employeemiddleware = passport.authenticate("jwt", { session: false });

module.exports = employeemiddleware;
