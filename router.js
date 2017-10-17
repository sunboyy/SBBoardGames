// var mysql = require('mysql');
// var bcrypt = require('bcrypt-nodejs');
var configView = require('./config/view');
// var pool = mysql.createPool(require('./config/database'));
var User = require('./models/user');
module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        res.render('index', { config: configView, user: req.user });
    });
    app.get('/signup', function (req, res) {
        res.render('signup', { config: configView, message: req.flash('signupMessage') });
    });
    app.post('/signup', function (req, res) {
        User.findOne({ username: req.body.username }, function (err, user) {
            if (err) throw err;
            if (user) {
                res.render('signup', { config: configView, message: "Username already exists" });
            }
            else {
                let newUser = new User();
                newUser.username = req.body.username;
                newUser.password = newUser.generateHash(req.body.password);
                newUser.save(function () {
                    res.redirect('/login');
                });
            }
        });
    });
    app.get('/login', function (req, res) {
        res.render('login', { config: configView, message: req.flash('loginMessage') });
    })
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    })
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile', { config: configView, user: req.user });
    });
};
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}