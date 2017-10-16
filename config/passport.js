var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var pool = mysql.createPool(require('./database'));

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        pool.getConnection(function (err, conn) {
            conn.query("SELECT * FROM `user` WHERE `id` = " + id, function (err, rows) {
                if (err) throw err;
                if (rows.length == 0) done("User not found", false);
                else done(null, rows[0]);
            });
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
    }, function (req, username, password, done) {
        pool.getConnection(function (err, conn) {
            conn.query("SELECT * FROM `user` WHERE `username` = '" + username + "'", function (err, rows) {
                if (err) throw err;
                if (rows.length == 0) {
                    done(null, false, req.flash('loginMessage', 'User not found'));
                }
                else {
                    if (bcrypt.compareSync(password, rows[0].password)) {
                        done(null, rows[0]);
                    }
                    else {
                        done(null, false, req.flash('loginMessage', 'Incorrect password'));
                    }
                }
            });
        });
    }));

    passport.use('local-signup', new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
    }, function (req, username, password, done) {
        process.nextTick(function () {
            if (!req.user) {
                pool.getConnection(function (err, conn) {
                    if (err) throw err;
                    conn.query("SELECT * FROM `user` WHERE `username` = '" + username + "'", function (err, rows) {
                        if (rows.length == 0) {
                            conn.query("INSERT INTO `user` VALUES (NULL, '" + username + "', '" + bcrypt.hashSync(password, bcrypt.genSaltSync(8)) + "')", function(err, rows) {
                                if (err) throw err;
                                conn.query("SELECT * FROM `user` WHERE `username` = '" + username + "'", function(err, rows) {
                                    done(null, rows[0]);
                                });
                            });
                        }
                        else {
                            done(null, false, req.flash('signupMessage', 'Username already exists'));
                        }
                    });
                });
            }
        });
    }));
}
