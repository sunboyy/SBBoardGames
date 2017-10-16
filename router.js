var configView = require('./config/view');
module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        res.render('index', { config: configView });
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
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {config: configView, user: req.user});
    });
};
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}