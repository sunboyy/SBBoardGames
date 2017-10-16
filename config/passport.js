var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var pool = mysql.createPool(require('./database'));

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        pool.getConnection(function(err, conn) {
            conn.query("SELECT * FROM `user` WHERE `id` = " + id, function(err, rows) {
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
    }, function(req, username, password, done) {
        let found = false;
        pool.getConnection(function(err, conn) {
            conn.query("SELECT * FROM `user` WHERE `username` = '" + username + "'", function(err, rows) {
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
}
