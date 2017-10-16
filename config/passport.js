var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var users = [
    {
        id: 1,
        username: "sunboy",
        password: "$2a$08$dHlJ2GJ9sQjnoHqwCJxWqerrFaGhCR/u4MbuKeAdAnurygRrNlsly"
    }
]
module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        users.forEach(function(user) {
            if (user.id == id) {
                done(null, user);
                return;
            }
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true
    }, function(req, username, password, done) {
        let found = false;
        users.forEach(function(user) {
            if (user.username == username) {
                if (bcrypt.compareSync(password, user.password)) {
                    done(null, user);
                }
                else {
                    done(null, false, req.flash('loginMessage', 'Incorrect Password'));
                }
                found = true;
            }
        });
        if (!found) {
            done(null, false, req.flash('loginMessage', 'User not found'));
        }
    }));
}
