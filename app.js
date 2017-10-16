var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

var config = require('./config');

var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: "helloandwelcometosunboysboardgames", resave: false, saveUninitialized: true }));
app.use(flash());
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

// Dev
app.use(require('nodeadmin')(app));

require('./router')(app, passport);

app.listen(config.common.runPort, function () {
    console.log("Running Board Games at port " + config.common.runPort);
});
