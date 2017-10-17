var configView = require('../config/view');
module.exports = function (app) {
    app.get('/avalon', isLoggedIn, function (req, res) {
        res.render('avalon/index', { config: configView });
    });
    app.get('/avalon/game', isLoggedIn, function (req, res) {
        res.render('avalon/game', { config: configView, user: req.user });
    });
}
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
