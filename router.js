var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var configView = require('./config/view');
var pool = mysql.createPool(require('./config/database'));
module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        res.render('index', { config: configView });
    });
    app.get('/signup', function (req, res) {
        res.render('signup', { config: configView, message: req.flash('signupMessage') });
    });
    app.post('/signup', function (req, res) {
        pool.getConnection(function (err, conn) {
            if (err) throw err;
            conn.query("SELECT * FROM `user` WHERE `username` = '" + req.body.username + "'", function (err, rows) {
                if (rows.length == 0) {
                    conn.query("INSERT INTO `user` VALUES (NULL, '" + req.body.username + "', '" + bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8)) + "')", function (err, rows) {
                        if (err) throw err;
                        res.redirect('/login');
                    });
                }
                else {
                    res.render('/signup', {config: configView, message: 'Username already exists'});
                }
            });
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