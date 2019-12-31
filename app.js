var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var loginRouter = require("./routes/login");
var logoutRouter = require("./routes/logout");
var checkloginRouter = require("./routes/checklogin");
var flash = require("connect-flash");
var passport = require("passport");
var app = express();
var passport = require("passport");
var session = require("express-session");
var mosca = require("mosca"); //
var mqtt = require("mqtt"); //https://www.npmjs.com/package/mqtt
var Topic = "home01"; //subscribe to all topics
var Broker_URL = "mqtt://192.168.1.101:1883";
var Database_URL = "localhost";
var bodyParser = require("body-parser");
const server = require("http").createServer(app); //
const io = require("socket.io")(server);
const port = 3000; //

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});
//------------------------------------- connect mqtt -----------------------------
var options = {
  clientId: "MyMQTT",
  port: 1883
  //username: 'mqtt_user',
  //password: 'mqtt_password',
  // keepalive : 60
};
const broker = new mosca.Server(options);
broker.on("ready", () => {
  console.log("broker is ready");
});
broker.on("published", pack => {
  message = pack.payload.toString();
  console.log(message);
});
var client = mqtt.connect(Broker_URL, options);
client.on("connect", mqtt_connect);
client.on("reconnect", mqtt_reconnect);
client.on("error", mqtt_error);
client.on("message", mqtt_messsageReceived);
client.on("close", mqtt_close);

function mqtt_connect() {
  //console.log("Connecting MQTT");
  client.subscribe(Topic, mqtt_subscribe);
  io.on("connection", socket => {
    client.on("message", function(topic, message, packet) {
      socket.emit("topic2", message.toString()); //emit server to cliend //topic 2 คือ event
    });
  });
}

function mqtt_subscribe(err, granted) {
  console.log("Subscribed to " + Topic);
  if (err) {
    console.log(err);
  }
}

function mqtt_reconnect(err) {
  //console.log("Reconnect MQTT");
  //if (err) {console.log(err);}
  client = mqtt.connect(Broker_URL, options);
}

function mqtt_error(err) {
  //console.log("Error!");
  //if (err) {console.log(err);}
}

function after_publish() {
  //do nothing
}

//receive a message from MQTT broker
function mqtt_messsageReceived(topic, message, packet) {
  var message_str = message.toString(); //convert byte array to string
  // message_str = message_str.replace(/\n$/, ''); //remove new line
  //payload syntax: clientID,topic,message
  // if (countInstances(message_str) != 1) {
  // 	console.log("Invalid payload");
  // 	} else {
  // 	insert_message(topic, message_str, packet);
  console.log(message_str);
  // }
}

function mqtt_close() {
  //console.log("Close MQTT");
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
// error handler
app.use("/login", checkloginRouter);
app.use("/index", indexRouter); // render
app.use("/users", usersRouter); // render
app.use("/login", loginRouter);
app.use("/logout", logoutRouter); // render
app.use("*", (req, res, next) => {
  res.render("error");
});
// app.listen(3000)
// module.exports = app;
server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
