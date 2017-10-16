var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

var config = require('./config');

var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({secret: "helloandwelcometosunboysboardgames", resave: false, saveUninitialized: true}));
app.use(flash());
app.set('view engine', 'ejs');

app.listen(config.runPort, function() {
    console.log("Running Board Games at port " + config.runPort);
});