var configView = require('./config/view');
module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        res.render('index', { config: configView });
    });
    app.get('/login', function (req, res) {
        res.render('login', { config: configView })
    })
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));
};